import api from "./axiosInstance";

/**
 * These map 1:1 to your auth.route.js:
 *   POST /auth/register
 *   POST /auth/login
 *   GET  /auth/me      (verifyJWT)
 *   POST /auth/logout  (verifyJWT)
 */
export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};