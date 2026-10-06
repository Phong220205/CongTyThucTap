import axios from 'axios';

// VITE_API_URL is set via .env.production at build time.
// Falls back to the production backend (Render) so deployed builds never use localhost.
const PROD_BACKEND = 'https://hdhome-backend.onrender.com/api';

export const API_BASE_URL = import.meta.env.VITE_API_URL || PROD_BACKEND;
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hdhome_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('hdhome_token');
      localStorage.removeItem('hdhome_user');
      if (window.location.pathname.startsWith('/dashboard')) window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const errors = error.response?.data?.errors as string[] | undefined;
    return errors?.join(' ') || error.response?.data?.message || 'Không thể kết nối máy chủ.';
  }
  return 'Có lỗi không xác định xảy ra.';
}
