import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

const excluded=new Set([
  "file-worker-deployment-contract.test.mjs",
  "datanest-ai-upload-source.test.mjs",
  "datanest-ai-source.test.mjs",
  "datanest-ai-file-worker.test.mjs",
  "certification-credentials.test.mjs",
  "audit-p1-remediation.test.mjs",
  "release-manifest-alignment.test.mjs",
  "ronsas-cloud-integration.test.mjs",
  "ui-production-authorization.test.mjs",
  "ui-test-mode.test.mjs",
  "worktree-gate-timeframes.test.mjs"
]);

const tests=readdirSync("tests/unit")
  .filter(name=>name.endsWith(".test.mjs"))
  .filter(name=>!excluded.has(name))
  .sort()
  .map(name=>"tests/unit/"+name);

if(!tests.length)throw new Error("Mirror unit suite resolved to zero tests.");

console.log("Mirror application/runtime unit suite:",tests.length,"files");
console.log("Files containing canonical-only workflow contracts excluded:",[...excluded].sort().join(", "));

const result=spawnSync(process.execPath,[
  "--test",
  "--experimental-strip-types",
  ...tests
],{
  stdio:"inherit",
  env:process.env
});

process.exit(result.status??1);
