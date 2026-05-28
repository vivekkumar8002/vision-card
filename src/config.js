export const BLOB_URL = import.meta.env.VITE_BLOB_URL || '';

// In development we proxy `/api` to the backend, so we can keep all
// client code relative.  When a real API URL is supplied via
// VITE_API_URL (e.g. in production), use that instead.
export const BASE_URL = (() => {
  if (import.meta.env.DEV) {
    // hit the same host that is serving the React app and let the
    // proxy in `vite.config.js` forward the request to :5000
    return '/api';
  }

  const raw = import.meta.env.VITE_API_URL || '/api';
  const s = String(raw).trim();
  if (s.startsWith(':')) return `http://localhost${s}`;
  if (/^https?:\/\//i.test(s)) return s;
  return `http://${s.replace(/^\/*/, '')}`;
})();
