export function healthHandler(request) {
  if (request.method !== 'GET') return { status: 405, body: { error: 'Method not allowed' } };
  return { status: 200, body: { ok: true, service: 'newugc' } };
}
