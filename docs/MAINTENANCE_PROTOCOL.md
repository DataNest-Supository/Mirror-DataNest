# Mirror-DataNest Maintenance Protocol

Mirror-DataNest uses scheduled maintenance that is autonomous for proven-safe cleanup while remaining isolated from canonical production authority.

- Branch Cleaner may delete only non-protected branches with no open pull request and no unique commits.
- Unknown or unique history is retained.
- Archived unique history is not scheduled for pruning.
- Streamliner applies only deterministic byte-safe text normalization and opens a Mirror pull request for tracked refinements.
- Reports are evidence, not certification.
- The Knowledge inbox automation branch is protected from branch cleanup.
- FREETREE receives its own local maintenance workflow and is never synchronized back to Mirror or DataNest.
