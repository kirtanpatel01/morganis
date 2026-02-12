"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts, getCategories, getStoresList } from "../_products/actions";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import type { Product, Category } from "../_products/types";

interface UseSuperAdminProductsOptions {
    initialProducts?: Product[];
    initialCategories?: Category[];
    initialStoresList?: { id: string; name: string }[];
}

export const useSuperAdminProducts = ({
    initialProducts,
    initialCategories,
    initialStoresList
}: UseSuperAdminProductsOptions = {}) => {
    const queryClient = useQueryClient();
    const supabase = createClient();

    // Queries
    const { data: products, isLoading: isLoadingProducts } = useQuery({
        queryKey: ['super-admin', 'products'],
        queryFn: () => getProducts({}), // Fetch all
        initialData: initialProducts
    });

    const { data: categories, isLoading: isLoadingCategories } = useQuery({
        queryKey: ['super-admin', 'categories'],
        queryFn: getCategories,
        initialData: initialCategories
    });

    const { data: storesList, isLoading: isLoadingStores } = useQuery({
        queryKey: ['super-admin', 'stores'],
        queryFn: getStoresList,
        initialData: initialStoresList
    });

    // Realtime Subscriptions
    useEffect(() => {
        const productsChannel = supabase.channel('super-admin-products-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'products' },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['super-admin', 'products'] });
                }
            )
            .subscribe();

        const categoriesChannel = supabase.channel('super-admin-categories-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'categories' },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['super-admin', 'categories'] });
                    queryClient.invalidateQueries({ queryKey: ['super-admin', 'products'] }); // Products might depend on categories
                }
            )
            .subscribe();

        const storesChannel = supabase.channel('super-admin-stores-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'stores' },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['super-admin', 'stores'] });
                    queryClient.invalidateQueries({ queryKey: ['super-admin', 'products'] }); // Products depend on stores
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(productsChannel);
            supabase.removeChannel(categoriesChannel);
            supabase.removeChannel(storesChannel);
        };
    }, [queryClient, supabase]);

    return {
        products: products || [],
        categories: categories || [],
        storesList: storesList || [],
        isLoading: isLoadingProducts || isLoadingCategories || isLoadingStores
    };
};
