import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api"
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      const cleanToken = token.trim();
      if (cleanToken.includes(" ") || cleanToken.split(".").length !== 3) {
        console.warn("Invalid JWT token detected in localStorage, removing token.");
        localStorage.removeItem("token");
      } else {
        config.headers.Authorization = `Bearer ${cleanToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;