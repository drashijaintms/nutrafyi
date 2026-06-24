import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auto token refresh on 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("adminRefreshToken");

      if (refreshToken) {
        try {
          // Attempt refresh
          const { data } = await axios.post("/api/admin/refresh", {
            refreshToken,
          });

          if (data?.accessToken) {
            localStorage.setItem("adminToken", data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return API(originalRequest);
          }
        } catch (refreshError) {
          console.error("Session expired. Logging out...", refreshError);
          localStorage.removeItem("adminUser");
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminRefreshToken");
          window.location.href = "/admin/login";
        }
      } else {
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
