import api from "../../api/axiosInstance";

// Maps 1:1 to backend admission.route.js
export const admissionApi = {
  // payload is a FormData (board, classType, course, documents[])
  create: (formData) =>
    api.post("/admission", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  mine: () => api.get("/admission/me"),
  all: () => api.get("/admission"),
  updateStatus: (id, payload) => api.patch(`/admission/${id}/status`, payload),
};
