import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDashboardStats, fetchRecentOrders, fetchStoreStatus, updateStoreStatus, updateOrderStatus } from "../api";
import { WebOrder } from "../types";

// Keys
export const DASHBOARD_KEYS = {
  stats: ["dashboard", "stats"],
  orders: ["dashboard", "orders"],
  storeStatus: ["dashboard", "storeStatus"],
};

// Hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.stats,
    queryFn: fetchDashboardStats,
  });
};

export const useRecentOrders = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.orders,
    queryFn: fetchRecentOrders,
  });
};

export const useStoreStatus = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.storeStatus,
    queryFn: fetchStoreStatus,
  });
};

export const useUpdateStoreStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStoreStatus,
    onSuccess: (newStatus) => {
      queryClient.setQueryData(DASHBOARD_KEYS.storeStatus, newStatus);
    },
  });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({orderId, status}: {orderId: string, status: WebOrder['status']}) => updateOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.orders });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.stats });
        }
    })
}
