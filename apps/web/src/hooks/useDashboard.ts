import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "@/services/dashboard.service.js";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchDashboardStats,
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
  });
}
