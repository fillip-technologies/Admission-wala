import api from "../../api/axiosInstance";

export const enquiryApi = {
    sendEnquiry : payload => api.post("/enquiry/sendenquiry",payload),
    
};