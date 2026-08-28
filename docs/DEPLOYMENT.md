# Deployment checklist

## Required server configuration

Set these variables only in the server/deployment environment:

- `SEEDANCE_API_KEY` (or `ARK_API_KEY`)
- `SEEDANCE_MODEL`
- `SEEDANCE_API_URL` (optional if using the default Ark Beijing API URL)

## Routes

Mount:

- `POST /api/generations` → `createGenerationHandler`
- `GET /api/generations/:id` → `createStatusHandler`

`server/router-example.js` shows the framework-neutral wiring.

## Product images

The browser currently keeps the selected image as a data URL. Before production generation, provide an image-storage/upload service that returns a provider-accessible HTTPS URL and pass that URL as `referenceImage`. Do not put permanent credentials in the browser.

## Persistence

`MemoryGenerationStore` is intentionally a development adapter. Replace it with durable storage (for example PostgreSQL/Redis + object storage) before production so jobs survive process restarts.

## Production readiness

The repository contains the application, prompt engine, provider adapter, job lifecycle and Studio UI, but a live production deployment still requires provider credentials, a configured Seedance model/endpoint, durable storage, image hosting, and an HTTP framework/hosting environment. These cannot be safely invented or committed from source control.
