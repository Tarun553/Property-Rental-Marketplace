import axios from "axios";

const api = axios.create({
  baseURL:
    (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(
      /\/$/,
      "",
    ) + "/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // Strip leading slash from URL to ensure it appends to baseURL path correctly
    if (config.url?.startsWith("/")) {
      config.url = config.url.substring(1);
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Optional: Redirect to login or use a global event to show login modal
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
