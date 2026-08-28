import { randomUUID } from 'node:crypto';

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return json(res, 503, { error: 'Image storage is not configured. Add BLOB_READ_WRITE_TOKEN in Vercel.' });

  const contentType = String(req.headers['content-type'] || '').split(';')[0].toLowerCase();
  if (!ALLOWED.has(contentType)) return json(res, 415, { error: 'Only JPG, PNG and WEBP images are supported.' });

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BYTES) return json(res, 413, { error: 'Image must be 10 MB or smaller.' });
    chunks.push(chunk);
  }
  if (!size) return json(res, 400, { error: 'Empty image upload.' });

  try {
    const { put } = await import('@vercel/blob');
    const rawName = decodeURIComponent(String(req.headers['x-file-name'] || 'product-image'))
      .replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 80) || 'product-image';
    const ext = contentType === 'image/jpeg' ? 'jpg' : contentType === 'image/png' ? 'png' : 'webp';
    const pathname = `newugc/products/${randomUUID()}-${rawName.replace(/\.[^.]+$/, '')}.${ext}`;
    const blob = await put(pathname, Buffer.concat(chunks), { access: 'public', contentType, addRandomSuffix: false });
    return json(res, 200, { url: blob.url, pathname: blob.pathname });
  } catch (error) {
    console.error('upload failed', error);
    return json(res, 500, { error: 'Image upload failed.' });
  }
}
