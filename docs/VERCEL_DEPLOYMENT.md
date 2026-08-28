# Vercel deployment

The repository now contains Vercel-compatible function entrypoints under `api/` and a root rewrite to the Studio UI.

## Required production environment variables

- `SEEDANCE_API_KEY`
- `SEEDANCE_MODEL`
- `SEEDANCE_API_URL` (optional; defaults to the Ark Beijing API base)

## Deployment

Connect the GitHub repository `ajaypanchal0692-web/newugc` to Vercel and deploy the `main` branch. Add the variables above in the Vercel Production environment before testing generation.

## Important limitation

The current `MemoryGenerationStore` is instance-local. It is suitable for a single-instance smoke test but is not durable across serverless invocations. Replace it with a persistent database before relying on asynchronous generation jobs in production.

Reference images also need to be uploaded to durable object storage and supplied as HTTPS URLs accessible to the video provider.
