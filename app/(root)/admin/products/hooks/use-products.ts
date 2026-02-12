import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from "../actions";

import { ProductFilters, Product } from "../types";

export const PRODUCT_KEYS = {
  all: ["products"],
  list: (filters?: ProductFilters) => ["products", "list", filters],
  details: (id: string) => ["products", "details", id],
  categories: ["products", "categories"],
};

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(filters),
    queryFn: () => getProducts(filters),
  });
};

export const useCategories = () => {
    return useQuery({
        queryKey: PRODUCT_KEYS.categories,
        queryFn: getCategories,
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
