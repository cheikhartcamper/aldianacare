/**
 * Helper to construct image URLs from API paths.
 *
 * The backend may return either:
 *  - Relative paths: "uploads/cni/uuid.jpeg" (per docs)
 *  - Absolute server paths: "/home/aldiana/app/uploads/photos/uuid.png" (actual behaviour)
 *
 * In both cases we extract the "uploads/..." portion and prepend the base URL.
 * Final URL: https://aldiianacare.online/uploads/photos/uuid.png
 * (Nginx must proxy /uploads/ → Express, see nginx/aldianacare.conf)
 */
export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const apiUrl = import.meta.env.VITE_API_URL || 'https://aldiianacare.online/api';
  const baseUrl = apiUrl.replace(/\/api$/, '');

  // Extract relative path starting from 'uploads/'
  const uploadsIdx = path.indexOf('uploads/');
  if (uploadsIdx !== -1) {
    return `${baseUrl}/${path.slice(uploadsIdx)}`;
  }

  // Fallback: strip leading slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
}
