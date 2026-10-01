import assert from "node:assert/strict";
import test from "node:test";
import { validateFeed } from "../../scripts/knowledge-feed-consumer.mjs";

const required={
  schemaVersion:"datanest-knowledge-feed-v1",
  target:"mirror",
  authority:"provisional_repository_learning",
  productionAuthorization:false,
  certifiedMemory:false
};

test("accepts a provisional Mirror-targeted feed",()=>{
  assert.deepEqual(validateFeed({...required,items:[],optimizationCandidates:[]},required),[]);
});

test("rejects authority escalation or wrong target",()=>{
  const failures=validateFeed({...required,target:"datanest",productionAuthorization:true,items:[],optimizationCandidates:[]},required);
  assert.equal(failures.length,2);
});
