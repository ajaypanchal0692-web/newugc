# Production status

## Code complete

- Product, creator and campaign data layers
- Structured prompt engine
- Five UGC concept generation
- Studio browser UI
- Provider abstraction
- Ark/Seedance transport boundary
- Asynchronous generation job lifecycle
- Generation/status HTTP routes
- Runnable Node server
- Health endpoint
- Request body limit
- Basic per-client generation rate limiting
- Secret-safe `.gitignore`
- Deployment checklist

## External configuration still required

- A valid Seedance/Ark API credential
- A valid Seedance model/endpoint ID
- Production HTTPS hosting
- Durable database/job storage
- Public/object storage for reference images and generated media
- Authentication/authorization for users
- Production observability and backups

Do not mark the service as live until an authenticated end-to-end generation succeeds in the deployment environment.
