import api from "../../api/axiosInstance";

// Maps 1:1 to backend auth.route.js
export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  verifyEmail: (payload) => api.post("/auth/verify-email", payload),
  resendOtp: (payload) => api.post("/auth/resend-otp", payload),
  forgotPassword: (payload) => api.post("/auth/forgot-password", payload),
  resetPassword: (payload) => api.post("/auth/reset-password", payload),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};
