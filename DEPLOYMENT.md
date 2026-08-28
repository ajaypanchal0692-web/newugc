# newugc deployment checklist

## Required Vercel environment

- `SEEDANCE_API_KEY` (or `ARK_API_KEY`)
- `SEEDANCE_MODEL`
- Optional `SEEDANCE_API_URL` (defaults to the Beijing Ark API base)
- `KV_REST_API_URL` + `KV_REST_API_TOKEN`, or `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`, for durable job storage

Never commit provider credentials.

## Local smoke test

```bash
npm test
SEEDANCE_API_KEY=... SEEDANCE_MODEL=... npm start
```

## Production verification

- `GET /api/health` should return `{ "ok": true, "service": "newugc" }`.
- `GET /api/config` exposes only safe booleans/status values; it never returns secrets.
- `POST /api/generations` creates a Seedance task.
- `GET /api/generations/:id` refreshes the provider status and returns the current job.

## Production requirements

1. Configure provider secrets in Vercel Project Settings → Environment Variables.
2. Configure Vercel KV/Upstash REST credentials for durable job persistence.
3. Product reference images must be HTTPS URLs for Seedance image input; the browser currently previews local uploads and sends data URLs, which are not forwarded as provider image URLs.
4. Add authentication/rate limiting before public paid generation access.
5. Confirm the selected Seedance model's current request/response contract and supported ratios, durations and resolutions.
6. Add durable media storage/CDN if generated output URLs are not permanent.
7. Configure usage limits, logs, metrics, billing/credits and retention before commercial launch.
