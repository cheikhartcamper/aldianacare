/**
 * Helper to construct image URLs from API paths.
 *
 * Backend stores relative paths in DB: "uploads/photos/uuid.png"
 * (previously stored absolute paths — resolveRelPath handles both cases)
 *
 * Static files are served at two routes:
 *  1. Without /api: https://aldianacare.com/uploads/...    (primary — Nginx direct / Express existant)
 *  2. With /api:    https://aldianacare.com/api/uploads/... (fallback — Express static, canonical)
 *
 * Use getImageUrls() for <img> tags (primary + onError fallback).
 * Use getImageUrl()  for <a href> links (primary only).
 */

function resolveRelPath(path: string): string {
  const idx = path.indexOf('uploads/');
  if (idx !== -1) return path.slice(idx);
  return path.startsWith('/') ? path.slice(1) : path;
}

/** Primary URL — /uploads/ (Nginx direct / Express existant) */
export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const apiUrl = (import.meta.env.VITE_API_URL || 'https://aldianacare.com/api').replace(/\/+$/, '');
  const baseUrl = apiUrl.replace(/\/api$/, '');
  return `${baseUrl}/${resolveRelPath(path)}`;
}

/** Both URL variants — [0] = /uploads/ (primary, Nginx direct / Express existant), [1] = /api/uploads/ (fallback) */
export function getImageUrls(path: string | null | undefined): [string, string] | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return [path, path];

  const apiUrl = (import.meta.env.VITE_API_URL || 'https://aldianacare.com/api').replace(/\/+$/, '');
  const baseUrl = apiUrl.replace(/\/api$/, '');
  const rel = resolveRelPath(path);
  return [`${baseUrl}/${rel}`, `${apiUrl}/${rel}`];
}
