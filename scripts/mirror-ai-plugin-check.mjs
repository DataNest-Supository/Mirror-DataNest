#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import process from "node:process";
import { pathToFileURL } from "node:url";
import path from "node:path";

export function validatePluginManifest(manifest){
  const failures=[];
  if(manifest?.schemaVersion!=="mirror-ai-plugin-lab-v1") failures.push("unsupported schemaVersion");
  if(!Array.isArray(manifest?.plugins)||!manifest.plugins.length) failures.push("plugins must be a non-empty array");
  const ids=new Set();
  for(const plugin of manifest?.plugins||[]){
    if(!plugin.id) failures.push("plugin id is required");
    if(ids.has(plugin.id)) failures.push("duplicate plugin id: "+plugin.id);
    ids.add(plugin.id);
    if(plugin.protocol!=="openai_compatible") failures.push(plugin.id+": unsupported protocol");
    if(plugin.defaultEndpoint){
      let url;
      try{url=new URL(plugin.defaultEndpoint);}catch{failures.push(plugin.id+": invalid defaultEndpoint");continue;}
      if(!["http:","https:"].includes(url.protocol)) failures.push(plugin.id+": endpoint must be HTTP(S)");
    }
  }
  if(manifest?.controls?.mirrorOnly!==true) failures.push("mirrorOnly control must be true");
  if(manifest?.controls?.noAutomaticPromotion!==true) failures.push("noAutomaticPromotion control must be true");
  return failures;
}

const envKey=(id)=>"MIRROR_AI_"+String(id).toUpperCase().replace(/[^A-Z0-9]+/g,"_")+"_MODELS_URL";

async function probe(plugin){
  const override=process.env[envKey(plugin.id)];
  const url=override||plugin.defaultModelsEndpoint;
  if(!url) return {id:plugin.id,status:"skipped",reason:"no_models_endpoint"};
  const parsed=new URL(url);
  const local=["localhost","127.0.0.1","::1"].includes(parsed.hostname)||parsed.hostname.endsWith(".local");
  if(!local&&parsed.protocol!=="https:") return {id:plugin.id,status:"rejected",reason:"hosted_probe_requires_https"};
  const response=await fetch(url,{headers:{Accept:"application/json"}});
  return {id:plugin.id,status:response.ok?"ok":"failed",httpStatus:response.status,url};
}

async function main(){
  const manifest=JSON.parse(await readFile("config/mirror-ai-plugins.json","utf8"));
  const failures=validatePluginManifest(manifest);
  if(failures.length) throw new Error("Mirror AI plugin registry invalid: "+failures.join("; "));
  const result={schemaVersion:manifest.schemaVersion,pluginCount:manifest.plugins.length,validated:true,probes:[]};
  if(process.argv.includes("--probe")){
    if(process.env.MIRROR_AI_PLUGIN_PROBE!=="1") throw new Error("Set MIRROR_AI_PLUGIN_PROBE=1 to enable endpoint probes.");
    for(const plugin of manifest.plugins) result.probes.push(await probe(plugin));
  }
  process.stdout.write(JSON.stringify(result,null,2)+"\n");
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  main().catch((error)=>{console.error(error);process.exitCode=1;});
}
