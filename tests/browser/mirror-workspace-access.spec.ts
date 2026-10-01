import { expect, test, type Page } from "@playwright/test";

const appPath=process.env.DATANEST_APP_PATH||"/";
const projectId="00000000-0000-4000-8000-000000000010";
const userId="00000000-0000-4000-8000-000000000001";

async function setupWorkspaceFixture(page:Page, failure:"missing"|"service") {
  const state={visible:false,projectReads:0,tableWrites:[] as string[],unexpectedBackends:[] as string[]};

  await page.route(/\/runtime-config\.js(?:\?.*)?$/,route=>route.fulfill({
    contentType:"application/javascript",
    body:"window.__DATANEST_CONFIG__={supabaseUrl:'https://fixture.supabase.co',supabasePublishableKey:'fixture-key',authoritative:true};"
  }));
  await page.addInitScript(({userId})=>{
    const encode=(value:unknown)=>btoa(JSON.stringify(value)).replaceAll("+","-").replaceAll("/","_").replaceAll("=","");
    localStorage.setItem("sb-fixture-auth-token",JSON.stringify({
      access_token:`${encode({alg:"HS256",typ:"JWT"})}.${encode({sub:userId,exp:4102444800,role:"authenticated"})}.fixture`,
      refresh_token:"fixture",token_type:"bearer",expires_at:4102444800,
      user:{id:userId,aud:"authenticated",role:"authenticated",email:"iace1236912@gmail.com"}
    }));
  },{userId});

  // Intercept every Supabase origin so the fixture cannot touch staging or production.
  await page.route(/^https:\/\/[^/]+\.supabase\.co\//,route=>{
    const request=route.request();
    const url=new URL(request.url());
    if(url.hostname!=="fixture.supabase.co") {
      state.unexpectedBackends.push(url.hostname);
      return route.abort();
    }
    const path=url.pathname;
    if(path.startsWith("/rest/v1/")&&!path.includes("/rpc/")&&!["GET","HEAD","OPTIONS"].includes(request.method())) {
      state.tableWrites.push(request.method()+" "+path);
    }
    let body:unknown=[];
    if(path.endsWith("/projects")) {
      state.projectReads++;
      if(!state.visible&&failure==="service") return route.fulfill({
        status:500,contentType:"application/json",
        body:JSON.stringify({message:"Workspace service temporarily unavailable",code:"XX000"})
      });
      body=state.visible?[{id:projectId,slug:"resonance-datanest",name:"Owner access fixture",description:null,status:"ACTIVE",created_at:"2026-10-01T00:00:00Z"}]:[];
    } else if(path.endsWith("/project_members")) {
      body=[{project_id:projectId,user_id:userId,role:"owner",status:"active"}];
    } else if(path.endsWith("/rpc/get_project_dashboard_summary")) {
      body={authorized:true,total_jobs:0,active_jobs:0,running_jobs:0,blocked_jobs:0,available_capabilities:0,registered_capabilities:0};
    } else if(path.endsWith("/rpc/accept_pending_project_member_invites_v1")||path.endsWith("/rpc/accept_pending_job_invites")) {
      body=null;
    }
    return route.fulfill({contentType:"application/json",body:JSON.stringify(body)});
  });
  return state;
}

for(const failure of ["missing","service"] as const) {
  test(`signed-in workspace recovers from ${failure} access after retry`,async({page})=>{
    const browserErrors:string[]=[];
    page.on("pageerror",error=>browserErrors.push(error.message));
    const state=await setupWorkspaceFixture(page,failure);
    await page.goto(appPath);

    const retry=page.getByRole("button",{name:"Retry workspace access"});
    const accessError=page.locator(".notice.errorNotice[role='alert']");
    const expectedError=failure==="missing"
      ?"Your signed-in account cannot access this workspace. Check its project membership, then retry."
      :"Workspace service temporarily unavailable";
    await expect(accessError).toHaveText(expectedError);
    await expect(page.getByRole("heading",{name:"Workspace unavailable"})).toBeVisible();
    await expect(retry).toBeEnabled();
    await expect(page.locator(".resonanceHome")).toHaveCount(0);
    await expect(page.getByRole("progressbar",{name:"Loading DataNest data"})).toHaveCount(0);

    // A retry cannot grant access; unchanged server state remains recoverable.
    const initialReads=state.projectReads;
    await retry.click();
    await expect.poll(()=>state.projectReads).toBeGreaterThan(initialReads);
    await expect(accessError).toHaveText(expectedError);
    await expect(retry).toBeEnabled();

    state.visible=true;
    await retry.click();
    await expect(page.locator(".resonanceHome")).toBeVisible();
    await expect(page.locator(".projectPill")).toContainText("Owner access fixture");
    await expect(page.getByText("Operator access",{exact:true})).toBeVisible();
    await expect(accessError).toHaveCount(0);
    await expect(retry).toHaveCount(0);
    expect(state.tableWrites).toEqual([]);
    expect(state.unexpectedBackends).toEqual([]);
    expect(browserErrors).toEqual([]);
  });
}
