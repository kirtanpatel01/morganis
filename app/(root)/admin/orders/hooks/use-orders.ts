import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOrders, updateOrderStatus } from "../api";
import { OrderFilters, OrderStatus } from "../types";

export const ORDER_KEYS = {
    list: (filters: OrderFilters) => ["orders", filters],
};

export const useOrders = (filters: OrderFilters) => {
    return useQuery({
        queryKey: ORDER_KEYS.list(filters),
        queryFn: () => fetchOrders(filters),
    });
};

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string, status: OrderStatus }) => updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] }); // Invalidate all orders
        }
    });
}
