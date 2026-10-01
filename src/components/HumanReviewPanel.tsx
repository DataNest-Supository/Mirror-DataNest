"use client";

import {useCallback,useEffect,useMemo,useState} from "react";
import styles from "./HumanReviewPanel.module.css";

type PullRequest={
  html_url:string;
  number:number;
  title:string;
  state:string;
  draft:boolean;
  merged_at:string|null;
  mergeable:boolean|null;
  head:{sha:string};
  requested_reviewers:Array<{login:string}>;
};

type Review={
  id:number;
  state:"APPROVED"|"CHANGES_REQUESTED"|"COMMENTED"|"DISMISSED"|"PENDING"|string;
  submitted_at:string|null;
  html_url:string;
  user:{login:string}|null;
};

type CheckRun={
  id:number;
  name:string;
  status:string;
  conclusion:string|null;
  html_url:string;
};

type Snapshot={
  pullRequest:PullRequest;
  reviews:Review[];
  checks:CheckRun[];
  loadedAt:string;
};

type Props={
  repository:string;
  pullRequestNumber:number;
  expectedReviewer:string;
};

const acceptedCheckConclusions=new Set(["success","neutral","skipped"]);

function latestReviewFor(reviews:Review[],reviewer:string){
  const matching=reviews
    .filter(review=>review.user?.login===reviewer&&review.state!=="PENDING")
    .sort((a,b)=>String(a.submitted_at||"").localeCompare(String(b.submitted_at||"")));
  return matching[matching.length-1]||null;
}

export default function HumanReviewPanel({repository,pullRequestNumber,expectedReviewer}:Props){
  const [snapshot,setSnapshot]=useState<Snapshot|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  const pullUrl="https://github.com/"+repository+"/pull/"+pullRequestNumber;

  const refresh=useCallback(async()=>{
    const controller=new AbortController();
    setLoading(true);
    setError("");
    try{
      const headers={Accept:"application/vnd.github+json"};
      const prResponse=await fetch(
        "https://api.github.com/repos/"+repository+"/pulls/"+pullRequestNumber,
        {headers,signal:controller.signal,cache:"no-store"}
      );
      if(!prResponse.ok)throw new Error("GitHub pull request evidence is unavailable ("+prResponse.status+").");
      const pullRequest=await prResponse.json() as PullRequest;

      const [reviewsResponse,checksResponse]=await Promise.all([
        fetch(
          "https://api.github.com/repos/"+repository+"/pulls/"+pullRequestNumber+"/reviews?per_page=100",
          {headers,signal:controller.signal,cache:"no-store"}
        ),
        fetch(
          "https://api.github.com/repos/"+repository+"/commits/"+pullRequest.head.sha+"/check-runs?per_page=100",
          {headers,signal:controller.signal,cache:"no-store"}
        )
      ]);
      if(!reviewsResponse.ok)throw new Error("GitHub human-review evidence is unavailable ("+reviewsResponse.status+").");
      if(!checksResponse.ok)throw new Error("GitHub check evidence is unavailable ("+checksResponse.status+").");

      const reviews=await reviewsResponse.json() as Review[];
      const checkPayload=await checksResponse.json() as {check_runs?:CheckRun[]};

      setSnapshot({
        pullRequest,
        reviews:Array.isArray(reviews)?reviews:[],
        checks:Array.isArray(checkPayload.check_runs)?checkPayload.check_runs:[],
        loadedAt:new Date().toISOString()
      });
    }catch(cause){
      if(cause instanceof DOMException&&cause.name==="AbortError")return;
      setError(cause instanceof Error?cause.message:"Unable to load human-review evidence.");
    }finally{
      setLoading(false);
    }
    return()=>controller.abort();
  },[repository,pullRequestNumber]);

  useEffect(()=>{void refresh()},[refresh]);

  const reviewerReview=useMemo(
    ()=>snapshot?latestReviewFor(snapshot.reviews,expectedReviewer):null,
    [snapshot,expectedReviewer]
  );

  const technicalState=useMemo(()=>{
    const checks=snapshot?.checks||[];
    if(!checks.length)return "UNKNOWN";
    if(checks.some(check=>check.status!=="completed"))return "RUNNING";
    if(checks.some(check=>!check.conclusion||!acceptedCheckConclusions.has(check.conclusion)))return "ATTENTION";
    return "PASS";
  },[snapshot]);

  const completedChecks=snapshot?.checks.filter(check=>check.status==="completed").length||0;
  const totalChecks=snapshot?.checks.length||0;
  const reviewState=reviewerReview?.state||"AWAITING_REVIEW";
  const approved=reviewState==="APPROVED";
  const changesRequested=reviewState==="CHANGES_REQUESTED";
  const merged=Boolean(snapshot?.pullRequest.merged_at);
  const mergeable=snapshot?.pullRequest.mergeable!==false;
  const readyForMerge=!merged&&approved&&technicalState==="PASS"&&mergeable&&!snapshot?.pullRequest.draft;

  const gateLabel=merged
    ?"MERGED"
    :changesRequested
      ?"CHANGES REQUESTED"
      :readyForMerge
        ?"REVIEW COMPLETE"
        :"HUMAN REVIEW REQUIRED";

  return <section className={styles.panel} aria-label="Human review panel" aria-busy={loading}>
    <div className={styles.head}>
      <div>
        <p className="eyebrow">HUMAN REVIEW · GOVERNANCE GATE</p>
        <h3>Production review panel</h3>
        <p className={styles.intro}>
          Live, read-only review evidence for the current canonical promotion. A recorded approval does not itself merge or deploy production.
        </p>
      </div>
      <span className={styles.gate} data-state={gateLabel}>{gateLabel}</span>
    </div>

    {error&&<div className={styles.alert} role="alert">
      <strong>Live review evidence needs attention</strong>
      <span>{error}</span>
    </div>}

    <div className={styles.grid}>
      <article className={styles.card}>
        <span>Promotion candidate</span>
        <strong>{snapshot?"#"+snapshot.pullRequest.number:"PR #"+pullRequestNumber}</strong>
        <small>{snapshot?.pullRequest.title||repository}</small>
      </article>

      <article className={styles.card}>
        <span>Requested reviewer</span>
        <strong>{expectedReviewer}</strong>
        <small>{snapshot?.pullRequest.requested_reviewers.some(item=>item.login===expectedReviewer)?"Formal review requested":"Reviewer request not currently recorded"}</small>
      </article>

      <article className={styles.card}>
        <span>Human decision</span>
        <strong>{reviewState.replaceAll("_"," ")}</strong>
        <small>{reviewerReview?.submitted_at?"Recorded "+new Date(reviewerReview.submitted_at).toLocaleString():"Awaiting a submitted GitHub review"}</small>
      </article>

      <article className={styles.card}>
        <span>Technical gates</span>
        <strong>{technicalState}</strong>
        <small>{totalChecks?completedChecks+"/"+totalChecks+" checks completed":"Check evidence not loaded"}</small>
      </article>
    </div>

    <div className={styles.flow} aria-label="Human review workflow">
      <div className={styles.step} data-complete={technicalState==="PASS"}><b>1</b><span><strong>Evidence</strong><small>Automated checks and live verification</small></span></div>
      <i aria-hidden="true">→</i>
      <div className={styles.step} data-complete={approved}><b>2</b><span><strong>Human review</strong><small>Approve, comment, or request changes in GitHub</small></span></div>
      <i aria-hidden="true">→</i>
      <div className={styles.step} data-complete={merged}><b>3</b><span><strong>Merge authority</strong><small>Separate governed production action</small></span></div>
    </div>

    <div className={styles.footer}>
      <div className={styles.note}>
        <span aria-hidden="true">◇</span>
        <p>
          <strong>Authority boundary:</strong> this panel observes review state only. It cannot submit a reviewer decision, impersonate a reviewer, merge a pull request, or deploy production.
        </p>
      </div>
      <div className={styles.actions}>
        <button className="secondaryButton compact" type="button" disabled={loading} onClick={()=>void refresh()}>
          {loading?"Refreshing…":"Refresh evidence"}
        </button>
        <a className="primaryButton compact" href={snapshot?.pullRequest.html_url||pullUrl} target="_blank" rel="noreferrer">
          Open formal review ↗
        </a>
      </div>
    </div>

    {snapshot&&<small className={styles.timestamp}>Evidence refreshed {new Date(snapshot.loadedAt).toLocaleString()} · head {snapshot.pullRequest.head.sha.slice(0,12)}</small>}
  </section>;
}
