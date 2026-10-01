# Mirror AI Plugin Lab

Mirror-DataNest has a separate R&D plugin registry for testing free/open inference runtimes without changing canonical DataNest provider authority.

## Included adapters

- **Ollama**
- **llama.cpp server**
- **vLLM**
- **LocalAI**
- **Hugging Face Text Generation Inference**
- **Generic OpenAI-compatible endpoint**

The adapters use the OpenAI-compatible chat-completions shape already understood by DataNest, which avoids adding large vendor SDK dependencies.

## Isolation

- This registry is Mirror-only.
- Local endpoints are for local R&D and are not proxied through canonical DataNest or the production Supabase project.
- Hosted testing must use an explicitly supplied HTTPS endpoint and staging-only credentials.
- Credentials remain environment variables; none are committed.
- The probe tool is disabled unless `MIRROR_AI_PLUGIN_PROBE=1` is explicitly set.
- A successful R&D probe is test evidence only. It does not approve a provider for canonical production.
- FREETREE is not synchronized with this plugin registry.

## Validate registry

```bash
node scripts/mirror-ai-plugin-check.mjs
```

## Optional endpoint probe

Set an endpoint override such as `MIRROR_AI_OLLAMA_MODELS_URL` or another plugin-specific `MIRROR_AI_<PLUGIN>_MODELS_URL`, then run:

```bash
MIRROR_AI_PLUGIN_PROBE=1 node scripts/mirror-ai-plugin-check.mjs --probe
```

The probe performs read-only model-discovery requests. It does not send prompts.
