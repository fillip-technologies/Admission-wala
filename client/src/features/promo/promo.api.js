import api from "../../api/axiosInstance";

// Maps 1:1 to backend promo.route.js
export const promoApi = {
  listPublic: () => api.get("/promos"), // active only, no auth
  listAll: () => api.get("/promos/all"), // admin: active + inactive
  create: (payload) => api.post("/promos", payload), // { title, text?, ctaLabel?, ctaHref?, active?, order? }
  update: (id, payload) => api.patch(`/promos/${id}`, payload),
  remove: (id) => api.delete(`/promos/${id}`),
};
