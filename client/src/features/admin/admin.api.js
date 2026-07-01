import api from "../../api/axiosInstance";


export const adminApi = {
  getAllStudents: () => api.get("/admin/getstudents"),
};