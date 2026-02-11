import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchStaff, createStaff, updateStaff, deleteStaff } from "../api";
import { StaffFilters } from "../types";

export const STAFF_KEYS = {
    list: (filters: StaffFilters) => ["staff", filters],
};

export const useStaff = (filters: StaffFilters) => {
    return useQuery({
        queryKey: STAFF_KEYS.list(filters),
        queryFn: () => fetchStaff(filters),
    });
};

export const useCreateStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createStaff,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
    });
};

export const useUpdateStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateStaff,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
    });
};

export const useDeleteStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteStaff,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
    });
};
