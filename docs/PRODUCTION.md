# NewUGC production readiness

## Current architecture

Browser → Vercel static Studio → `/api/generations` → GenerationService → SeedanceProvider → Seedance HTTP API.

Generation jobs use Redis-compatible REST storage when configured and an in-process fallback otherwise.

## Vercel configuration

Set these as encrypted environment variables for Production:

- `SEEDANCE_API_KEY`
- `SEEDANCE_MODEL`
- `SEEDANCE_API_URL` (optional)
- `KV_REST_API_URL` / `KV_REST_API_TOKEN` or Upstash equivalents

Do not expose provider keys to browser code.

## Reference image limitation

Seedance image input expects an HTTPS image URL in the current adapter. A browser `data:` URL is intentionally not forwarded. Before enabling image-based generation, add an authenticated upload endpoint backed by durable object storage and pass the resulting HTTPS URL to the generation endpoint.

## Commercial launch checklist

- Authentication and user/project ownership
- Per-user rate limits and concurrency limits
- Credits/subscription billing
- Durable media storage and cleanup policy
- Provider timeout/retry policy
- Webhook or background polling strategy for long-running jobs
- Abuse/content policy and moderation
- Analytics and error monitoring
- Privacy policy and terms
- Secret rotation
- Automated tests for provider contract changes
