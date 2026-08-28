# Seedance integration

newugc keeps the provider secret on the server and calls the selected Seedance service through `SeedanceHttpTransport`. Browser code must never contain the API key.

## Official Ark configuration

The default transport targets the Volcengine Ark API base URL:

- `SEEDANCE_API_URL=https://ark.cn-beijing.volces.com/api/v3`
- `SEEDANCE_API_KEY=<server secret>`
- `SEEDANCE_MODEL=<Seedance-enabled model name or endpoint ID>`

The transport submits an asynchronous task to `/contents/generations/tasks` and polls `/contents/generations/tasks/{task_id}`.

## Reference inputs

The transport accepts reference image URLs and sends them as structured image content. For production, the application should first upload/host the product image at a provider-accessible URL and then pass that URL to the server.

## Production checklist

1. Create/configure the appropriate Ark model or endpoint for the account.
2. Put the API key only in server environment/secret storage.
3. Set `SEEDANCE_MODEL` to the exact enabled model/endpoint ID.
4. Verify the account's supported duration, resolution, aspect ratio, audio and reference-media limits.
5. Verify the exact response fields returned by the enabled endpoint before relying on them in production.
6. Add authentication, rate limits, quota accounting and persistent job storage before opening generation to users.

Do not commit real credentials. The repository contains only placeholders.
