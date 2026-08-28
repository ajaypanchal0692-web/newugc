# newugc deployment checklist

## Required server environment

- `SEEDANCE_API_KEY` (or `ARK_API_KEY`)
- `SEEDANCE_MODEL`
- Optional `SEEDANCE_API_URL` (defaults to the Beijing Ark API base)
- `PORT` (defaults to `3000`)

Never commit provider credentials.

## Local smoke test

```bash
npm test
SEEDANCE_API_KEY=... SEEDANCE_MODEL=... npm start
```

Then verify `GET /health` returns `{ "ok": true, "service": "newugc" }`.

## Production requirements

1. Put the Node server behind HTTPS.
2. Configure the provider secret and model ID in the host's secret manager.
3. Replace `MemoryGenerationStore` with durable storage before multi-instance deployment.
4. Store uploaded product images at an HTTPS-accessible URL before sending them to the provider.
5. Add authentication/rate limiting to generation endpoints before exposing them publicly.
6. Confirm the selected Seedance model's current request/response contract and supported ratios, durations and resolutions.
7. Configure logs/metrics and a retention policy for generated media and prompts.
