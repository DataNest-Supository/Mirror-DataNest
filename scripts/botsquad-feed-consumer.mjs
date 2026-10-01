#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const sha256=value=>createHash("sha256").update(value).digest("hex");

export function validateBotsquadFeed(feed,required){
  const failures=[];
  for(const [key,value] of Object.entries(required||{})){
    if(feed?.[key]!==value) failures.push(`${key}: expected ${JSON.stringify(value)}, received ${JSON.stringify(feed?.[key])}`);
  }
  for(const key of ["recommendations","uxEaseFeed","functionEvolutionFeed","risks","sourceBots"]){
    if(!Array.isArray(feed?.[key])) failures.push(key+" must be an array");
  }
  return failures;
}

async function main(){
  const config=JSON.parse(await readFile("config/botsquad-consumer.json","utf8"));
  const response=await fetch(process.env.DATANEST_BOTSQUAD_FEED_URL||config.sourceUrl,{headers:{Accept:"application/json","User-Agent":"mirror-datanest-botsquad-consumer"}});
  if(response.status===404){
    console.log(JSON.stringify({status:"feed_not_generated"},null,2));
    return;
  }
  if(!response.ok) throw new Error("BOTSQUAD feed fetch failed: "+response.status);
  const raw=await response.text();
  const feed=JSON.parse(raw);
  const failures=validateBotsquadFeed(feed,config.requiredFeed);
  if(failures.length) throw new Error("BOTSQUAD feed rejected: "+failures.join("; "));
  const envelope={
    schemaVersion:"mirror-botsquad-inbox-v1",
    consumedAt:new Date().toISOString(),
    source:{repository:config.sourceRepository,branch:config.sourceBranch,path:config.sourcePath,sha256:"sha256:"+sha256(raw)},
    feed
  };
  await mkdir(path.dirname(config.targetPath),{recursive:true});
  await writeFile(config.targetPath,JSON.stringify(envelope,null,2)+"\n");
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  main().catch(error=>{console.error(error);process.exitCode=1;});
}
