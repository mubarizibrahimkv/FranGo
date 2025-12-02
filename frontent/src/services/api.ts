import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { store } from "../redux/store/store";
import { logoutUser } from "../redux/slice/authSlice";
import { CUSTOMER_BASE_ROUTE } from "../constants/apiRoutes";

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    } else {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (
    error: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } },
  ) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        store.dispatch(logoutUser());
        window.location.href = `/${CUSTOMER_BASE_ROUTE}/login`;
      }
    }

    if (error.response?.status === 403) {
      store.dispatch(logoutUser());
      window.location.href = `/${CUSTOMER_BASE_ROUTE}/login`;
    }

    return Promise.reject(error);
  },
);

export default api;
