import api from "../../api/axiosInstance";

// Maps 1:1 to backend counselling.route.js
export const counsellingApi = {
  request: (payload) => api.post("/counselling/request", payload),
  mine: () => api.get("/counselling/me"),
  // scope: "open" | "assigned" | "all"
  list: (scope = "assigned") => api.get("/counselling", { params: { scope } }),
  claim: (id) => api.patch(`/counselling/${id}/claim`),
  updateStatus: (id, payload) => api.patch(`/counselling/${id}/status`, payload),
  addNote: (id, note) => api.post(`/counselling/${id}/notes`, { note }),
};

export const COUNSELLING_STATUS_LABEL = {
  requested: "Requested",
  assigned: "Assigned",
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};
