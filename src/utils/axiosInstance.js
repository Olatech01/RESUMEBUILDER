import axios from "axios";
import { BASE_URL } from "./apiPaths";



const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});



axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token")
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            // Handle response errors
            return Promise.reject(error);
        } else if (error.code === "ECONNABORTED") {
            // Handle timeout more gracefully
            const customError = new Error("Request timed out. Please check your connection and try again.");
            customError.isTimeout = true;
            return Promise.reject(customError);
        }
        return Promise.reject(error);
    }
);


export default axiosInstance