import api from "../../api/axiosInstance";

// Maps 1:1 to backend auth.route.js
export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};
