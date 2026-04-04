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

// Mutex to prevent concurrent refresh attempts
let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

function processPendingRequests(token: string): void {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
}

// Handle 401 and refresh token
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const originalConfig = error.config;
    const refreshToken = useAuthStore.getState().refreshToken;

    if (!refreshToken || !originalConfig) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until refresh completes
      return new Promise((resolve) => {
        pendingRequests.push((token) => {
          originalConfig.headers.Authorization = `Bearer ${token}`;
          resolve(api.request(originalConfig));
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await axios.post<{
        success: boolean;
        data: { accessToken: string; refreshToken: string };
      }>(`${BASE_URL}/api/auth/refresh`, { refreshToken });

      if (data.success && data.data) {
        useAuthStore.getState().setTokens(data.data.accessToken, data.data.refreshToken);
        processPendingRequests(data.data.accessToken);
        originalConfig.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api.request(originalConfig);
      }

      useAuthStore.getState().logout();
      return Promise.reject(error);
    } catch {
      useAuthStore.getState().logout();
      pendingRequests = [];
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
