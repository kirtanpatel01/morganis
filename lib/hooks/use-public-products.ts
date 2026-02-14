"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicProducts, getPublicCategories, getPublicStores } from "@/lib/actions/public-products";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Product } from "@/components/pos/product-data";

interface UsePublicProductsOptions {
    initialProducts?: Product[];
    initialCategories?: string[];
    initialStores?: string[];
}

export const usePublicProducts = ({ initialProducts, initialCategories, initialStores }: UsePublicProductsOptions = {}) => {
    const queryClient = useQueryClient();
    const supabase = createClient();

    // Realtime subscription
    useEffect(() => {
        const productsChannel = supabase.channel('realtime-products-public-all')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'products' },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['public', 'products'] });
                }
            )
            .subscribe();

        const categoriesChannel = supabase.channel('realtime-categories-public-all')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'categories' },
                () => {
                   // If a category is added/removed, we might reload categories list
                   // And products list if it affects display
                    queryClient.invalidateQueries({ queryKey: ['public', 'categories'] });
                }
            )
            .subscribe();
        
        const storesChannel = supabase.channel('realtime-stores-public-all')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'stores' },
                () => {
                    // If store status changes (e.g. active -> inactive), we must refresh products
                    // We check payload.new.status vs payload.old.status if available, but invalidating is safest
                    queryClient.invalidateQueries({ queryKey: ['public', 'products'] });
                    queryClient.invalidateQueries({ queryKey: ['public', 'categories'] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(productsChannel);
            supabase.removeChannel(categoriesChannel);
            supabase.removeChannel(storesChannel);
        };
    }, [queryClient, supabase]);

    const { data: products } = useQuery({
        queryKey: ['public', 'products'],
        queryFn: getPublicProducts,
        initialData: initialProducts
    });

    const { data: categories } = useQuery({
        queryKey: ['public', 'categories'],
        queryFn: getPublicCategories,
        initialData: initialCategories
    });

    const { data: stores } = useQuery({
        queryKey: ['public', 'stores'],
        queryFn: getPublicStores,
        initialData: initialStores
    });

    return { products, categories, stores };
};
