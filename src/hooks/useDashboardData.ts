import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "@/lib/mockApi";

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });
}
