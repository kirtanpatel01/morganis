import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchStoreSettings, updateStoreSettings, fetchUserProfile, updateUserProfile } from "../api";
import { StoreSettings, UserProfile } from "../types";

export const SETTINGS_KEYS = {
    store: ["settings", "store"],
    profile: ["settings", "profile"],
};

export const useStoreSettings = () => {
    return useQuery({
        queryKey: SETTINGS_KEYS.store,
        queryFn: fetchStoreSettings,
    });
};

export const useUpdateStoreSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateStoreSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.store });
        }
    });
};

export const useUserProfile = () => {
    return useQuery({
        queryKey: SETTINGS_KEYS.profile,
        queryFn: fetchUserProfile,
    });
};

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUserProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.profile });
        }
    });
};
