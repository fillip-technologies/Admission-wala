import api from "../../api/axiosInstance";

export const adminApi = {
  getAllStudents: () => api.get("/admin/getstudents"),
  getAllEnquiry: () => api.get("/admin/fetchenquiry"),
  getAllCounsellers: () => api.get("/admin/getallcounsellers"),
  createCounseller: (payload) => api.post("/admin/createcounseller", payload),
  getReports: () => api.get("/admin/reports"),
};
