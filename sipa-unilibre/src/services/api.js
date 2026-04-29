import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Interceptor de REQUEST — agrega el token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sipa_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de RESPONSE — maneja errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("sipa_token");
      localStorage.removeItem("sipa_usuario");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default api;
