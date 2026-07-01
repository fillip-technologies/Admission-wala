import api from "../../api/axiosInstance";

export const adminApi = {
  getAllStudents: () => api.get("/admin/getstudents"),
  getAllEnquiry: () => api.get("/admin/fetchenquiry"),
};