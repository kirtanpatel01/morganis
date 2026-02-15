import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, createCategory, deleteCategory } from "../actions";
import { ProductFilters, Product, Category } from "../types";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export const PRODUCT_KEYS = {
  all: ["products"],
  list: (filters?: ProductFilters) => ["products", "list", filters],
  details: (id: string | undefined) => ["products", "details", id],
  categories: ["products", "categories"],
};

interface UseProductsOptions {
    filters?: ProductFilters;
    initialData?: { data: Product[]; total: number };
}

export const useProducts = ({ filters, initialData }: UseProductsOptions = {}) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(filters),
    queryFn: () => getProducts(filters),
    initialData: initialData, // Only works if queryKey matches initial fetching logic
    // React Query 5: placeholderData can also be used, but initialData is fine for SSR hydration equivalent.
  });
};

export const useCategories = (initialData?: Category[]) => {
    return useQuery({
        queryKey: PRODUCT_KEYS.categories,
        queryFn: getCategories,
        initialData: initialData,
    });
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
};

// --- Categories Mutations ---

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.categories });
        }
    });
}

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.categories });
        }
    });
}

// --- Realtime Subscription ---

export const useRealtimeProducts = () => {
    const queryClient = useQueryClient();
    const supabase = createClient();

    useEffect(() => {
        const productChannel = supabase
            .channel('realtime-products-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'products' },
                (payload: { [key: string]: any }) => {
                    console.log('Realtime product change:', payload);
                    queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
                }
            )
            .subscribe();

        const categoryChannel = supabase
            .channel('realtime-categories-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'categories' },
                (payload: { [key: string]: any }) => {
                    console.log('Realtime category change:', payload);
                    queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.categories });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(productChannel);
            supabase.removeChannel(categoryChannel);
        };
    }, [queryClient, supabase]);
};
