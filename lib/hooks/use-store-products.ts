"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStoreProducts, getStoreCategories } from "@/lib/actions/public-products";
import { Product } from "@/components/pos/product-data";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

interface UseStoreProductsOptions {
    storeId: string;
    initialProducts?: Product[];
    initialCategories?: string[];
}

export const useStoreProducts = ({ storeId, initialProducts, initialCategories }: UseStoreProductsOptions) => {
    const queryClient = useQueryClient();
    const supabase = createClient();

    // Realtime subscription
    useEffect(() => {
        // Subscribe to products changes for this store
        const productsChannel = supabase.channel(`realtime-products-store-${storeId}`)
            .on(
                'postgres_changes',
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'products',
                    filter: `store_id=eq.${storeId}` 
                },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['store', storeId, 'products'] });
                }
            )
            .subscribe();

        // Subscribe to categories changes for this store
        // Note: categories also have store_id
        const categoriesChannel = supabase.channel(`realtime-categories-store-${storeId}`)
            .on(
                'postgres_changes',
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'categories',
                    filter: `store_id=eq.${storeId}`
                },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['store', storeId, 'categories'] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(productsChannel);
            supabase.removeChannel(categoriesChannel);
        };
    }, [queryClient, supabase, storeId]);

    const { data: products } = useQuery({
        queryKey: ['store', storeId, 'products'],
        queryFn: () => getStoreProducts(storeId),
        initialData: initialProducts,
        staleTime: 1000 * 60, // 1 minute
    });

    const { data: categories } = useQuery({
        queryKey: ['store', storeId, 'categories'],
        queryFn: () => getStoreCategories(storeId),
        initialData: initialCategories,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return { products, categories };
};
