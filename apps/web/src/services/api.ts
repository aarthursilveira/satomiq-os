import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { useAuthStore } from "@/stores/auth.store.js";

const BASE_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:3001";

export const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Inject access token on every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 and refresh token
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const refreshToken = useAuthStore.getState().refreshToken;

      if (refreshToken) {
        try {
          const { data } = await axios.post<{
            success: boolean;
            data: { accessToken: string; refreshToken: string };
          }>(`${BASE_URL}/api/auth/refresh`, { refreshToken });

          if (data.success && data.data) {
            useAuthStore.getState().setTokens(
              data.data.accessToken,
              data.data.refreshToken,
            );

            if (axios.isAxiosError(error) && error.config) {
              error.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
              return api.request(error.config);
            }
          }
        } catch {
          useAuthStore.getState().logout();
        }
      } else {
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  },
);

export default api;
