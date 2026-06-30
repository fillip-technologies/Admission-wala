import axios from "axios";

/**
 * Single axios instance for the whole app.
 *
 * withCredentials: true is REQUIRED — your backend uses cookieParser + a
 * refreshToken, so the access/refresh tokens are sent as httpOnly cookies.
 * Without this flag the browser will not attach those cookies and /me + /logout
 * will always 401.
 *
 * Set VITE_API_URL in a .env file at the project root, e.g.
 *   VITE_API_URL=http://localhost:8000/api/v1
 * (change the port to whatever your Express server listens on)
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default api;