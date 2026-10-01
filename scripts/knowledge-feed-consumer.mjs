#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const sha256=(value)=>createHash("sha256").update(value).digest("hex");

export function validateFeed(feed,required){
  const failures=[];
  for(const [key,value] of Object.entries(required||{})){
    if(feed?.[key]!==value) failures.push(`${key}: expected ${JSON.stringify(value)}, received ${JSON.stringify(feed?.[key])}`);
  }
  if(!Array.isArray(feed?.items)) failures.push("items must be an array");
  if(!Array.isArray(feed?.optimizationCandidates)) failures.push("optimizationCandidates must be an array");
  return failures;
}

async function main(){
  const configPath=process.argv[2]||"config/knowledge-consumer.json";
  const config=JSON.parse(await readFile(configPath,"utf8"));
  const sourceUrl=process.env.DATANEST_KNOWLEDGE_FEED_URL||config.sourceUrl;
  const response=await fetch(sourceUrl,{headers:{Accept:"application/json","User-Agent":"mirror-datanest-knowledge-consumer"}});
  if(response.status===404){
    process.stdout.write(JSON.stringify({status:"feed_not_generated",source:sourceUrl},null,2)+"\n");
    return;
  }
  if(!response.ok) throw new Error(`Knowledge feed fetch failed: ${response.status} ${response.statusText}`);
  const raw=await response.text();
  const feed=JSON.parse(raw);
  const failures=validateFeed(feed,config.requiredFeed);
  if(failures.length) throw new Error("Knowledge feed rejected: "+failures.join("; "));

  const envelope={
    schemaVersion:"mirror-knowledge-inbox-v1",
    consumedAt:new Date().toISOString(),
    source:{
      repository:config.sourceRepository,
      branch:config.sourceBranch,
      path:config.sourcePath,
      sha256:"sha256:"+sha256(raw)
    },
    feed
  };
  await mkdir(path.dirname(config.targetPath),{recursive:true});
  await writeFile(config.targetPath,JSON.stringify(envelope,null,2)+"\n");
  process.stdout.write(JSON.stringify({target:config.targetPath,itemCount:feed.items.length,sourceDigest:envelope.source.sha256},null,2)+"\n");
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  main().catch((error)=>{console.error(error);process.exitCode=1;});
}
