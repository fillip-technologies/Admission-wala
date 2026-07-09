import api from "../../api/axiosInstance";

// Maps 1:1 to backend program.route.js
export const programApi = {
  listPublic: () => api.get("/programs"), // active only, no auth
  listAll: () => api.get("/programs/all"), // admin: active + inactive
  create: (payload) => api.post("/programs", payload), // { name, category?, href?, active?, order? }
  update: (id, payload) => api.patch(`/programs/${id}`, payload),
  remove: (id) => api.delete(`/programs/${id}`),
};
