import api from "../../api/axiosInstance";

// Maps 1:1 to backend announcement.route.js
export const announcementApi = {
  listPublic: () => api.get("/announcements"), // active only, no auth
  listAll: () => api.get("/announcements/all"), // admin: active + inactive
  create: (payload) => api.post("/announcements", payload), // { text, tag?, href?, active? }
  update: (id, payload) => api.patch(`/announcements/${id}`, payload),
  remove: (id) => api.delete(`/announcements/${id}`),
};
