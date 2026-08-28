# newugc

AI-powered UGC video creation platform.

## Scope

- Product-focused UGC video generation
- Reusable AI video prompt templates
- Male and female creator personas
- Advertising and social-media workflows
- Seedance-compatible prompt generation
- Product image/reference-media workflows
- Vercel-compatible API endpoints

## Reference

Prompt organization and Seedance workflow research is informed by the MIT-licensed `ZeroLu/awesome-seedance` repository. Third-party material referenced there is treated separately and is not assumed to be covered by that repository's MIT license.

## Deployment

The `main` branch is connected to the Vercel project `newugc`. Vercel should create a deployment when commits reach `main`.

Required server-side environment variables for live Seedance generation:

- `SEEDANCE_API_URL`
- `SEEDANCE_API_KEY`
- `SEEDANCE_MODEL`

Never commit provider credentials to this repository.

## Health check

The Vercel deployment exposes `GET /api/health` and returns `{ "ok": true, "service": "newugc" }` when the deployment is healthy.

## Status

MVP implementation consolidated on `main`; production generation requires valid Seedance credentials/model configuration and durable job/media storage.
