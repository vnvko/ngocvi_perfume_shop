// Chuẩn hóa URL ảnh/file tĩnh: đường dẫn /uploads/... phải trỏ tới origin backend, không phải Vite
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ORIGIN = String(rawBase).replace(/\/api\/?$/i, '');

export function mediaUrl(path) {
  if (path == null || path === '') return '';
  const p = String(path).trim();
  if (!p) return '';
  if (/^https?:\/\//i.test(p) || p.startsWith('data:') || p.startsWith('blob:')) return p;
  const pathPart = p.startsWith('/') ? p : `/${p}`;
  return `${API_ORIGIN}${pathPart}`;
}
