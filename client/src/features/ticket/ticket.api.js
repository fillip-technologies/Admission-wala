import api from "../../api/axiosInstance";

// Maps 1:1 to backend ticket.route.js
export const ticketApi = {
  create: (payload) => api.post("/tickets", payload), // { subject, admission?, message? }
  mine: () => api.get("/tickets/me"),
  all: (status) => api.get("/tickets", { params: status ? { status } : {} }),
  get: (id) => api.get(`/tickets/${id}`),
  addMessage: (id, payload) => api.post(`/tickets/${id}/messages`, payload), // { body?, resourceUrl?, resourceLabel? }
  updateStatus: (id, payload) => api.patch(`/tickets/${id}/status`, payload), // { status }
};

export const TICKET_STATUS_LABEL = {
  open: "Open",
  closed: "Closed",
};
