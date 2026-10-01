import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { validatePluginManifest } from "../../scripts/mirror-ai-plugin-check.mjs";

const manifest=JSON.parse(readFileSync("config/mirror-ai-plugins.json","utf8"));

test("Mirror AI plugin registry is valid and isolated",()=>{
  assert.deepEqual(validatePluginManifest(manifest),[]);
  assert.equal(manifest.controls.mirrorOnly,true);
  assert.equal(manifest.controls.noAutomaticPromotion,true);
  assert.equal(manifest.canonicalPromotionAuthority,false);
});

test("core open runtimes are registered",()=>{
  const ids=new Set(manifest.plugins.map((plugin)=>plugin.id));
  for(const id of ["ollama","llama_cpp","vllm","localai","huggingface_tgi","generic_openai_compatible"]){
    assert.equal(ids.has(id),true,id+" missing");
  }
});

test("no plugin embeds credentials",()=>{
  for(const plugin of manifest.plugins){
    assert.equal("apiKey" in plugin,false);
    assert.equal("token" in plugin,false);
  }
});
