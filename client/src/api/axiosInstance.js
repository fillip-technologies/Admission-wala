import axios from "axios";

/**
 * Shared axios instance.
 * withCredentials sends/receives the httpOnly auth cookies your backend sets
 * on login (cookieParser + refreshToken). Required or /me and /logout 401.
 *
 * .env:  VITE_API_URL=http://localhost:3000/api/v1
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Cross-site cookies get blocked by browsers, so we also carry the auth token
// in the Authorization header. Stored on login (see auth.slice.js).
export const TOKEN_KEY = "accessToken";
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Central place to react to auth failures as the app grows.
 * NOTE: /me returning 401 for a guest is normal, so we don't hard-redirect here.
 * When you add a POST /auth/refresh route, this is where you'd queue the failed
 * request, hit refresh, and retry. Left as a clearly-marked extension point.
 */
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // if (error.response?.status === 401) { /* TODO: refresh-token retry */ }
    return Promise.reject(error);
  },
);

export default api;
