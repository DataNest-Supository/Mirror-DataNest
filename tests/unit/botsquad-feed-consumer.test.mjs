import test from "node:test";
import assert from "node:assert/strict";
import { validateBotsquadFeed } from "../../scripts/botsquad-feed-consumer.mjs";

const required={schemaVersion:"datanest-botsquad-consolidated-feed-v1",target:"mirror",authority:"advisory",productionAuthorization:false};

test("accepts non-authorizing Mirror BOTSQUAD feed",()=>{
  const feed={...required,recommendations:[],uxEaseFeed:[],functionEvolutionFeed:[],risks:[],sourceBots:[]};
  assert.deepEqual(validateBotsquadFeed(feed,required),[]);
});

test("rejects target or authority escalation",()=>{
  const feed={...required,target:"datanest",productionAuthorization:true,recommendations:[],uxEaseFeed:[],functionEvolutionFeed:[],risks:[],sourceBots:[]};
  assert.equal(validateBotsquadFeed(feed,required).length,2);
});
