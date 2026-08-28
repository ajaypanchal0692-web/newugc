# Seedance integration

The application keeps the Seedance secret and provider endpoint on the server. Browser code must call the application's generation route instead of the provider directly.

## Configuration

Set these server environment variables:

- `SEEDANCE_API_URL`
- `SEEDANCE_API_KEY`

## Flow

1. Browser submits a selected prompt to `POST /api/generations`.
2. Server validates the project and prompt.
3. `SeedanceProvider` delegates to `SeedanceHttpTransport`.
4. The transport sends the provider request using the server-only bearer token.
5. The returned provider job ID is stored in the generation job.
6. A server-side status worker/endpoint can call `GenerationService.refresh()` until completion.

## Provider contract note

The transport deliberately isolates the HTTP endpoint and request/response mapping. Before production activation, align `src/providers/seedance-http.js` with the exact API contract of the selected Seedance service (endpoint path, authentication scheme, request fields, response fields, webhook/polling behavior and content upload requirements). Do not assume that every Seedance distribution exposes the same API.
