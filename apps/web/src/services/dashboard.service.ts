import api from "@/services/api.js";
import type { ApiResponse } from "@satomiq/shared";

export async function fetchDashboardStats() {
  const { data } = await api.get<ApiResponse<unknown>>("/dashboard/stats");
  return data.data;
}
