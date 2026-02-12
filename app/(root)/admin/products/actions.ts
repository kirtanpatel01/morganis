"use server";

import { createClient } from "@/lib/supabase/server";
import { Product, ProductFilters, Category } from "./types";
import { revalidatePath } from "next/cache";

// --- Products ---

export async function getStoreStatus(): Promise<{ id: string; status: string } | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: store, error } = await supabase
        .from("stores")
        .select("id, status")
        .eq("admin_id", user.id)
        .single();

    if (error || !store) return null;

    return store;
}

export async function getProducts(filters?: ProductFilters): Promise<{ data: Product[]; total: number }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { data: [], total: 0 };

    // Get store ID for the admin
    const { data: store } = await supabase
        .from("stores")
        .select("id")
        .eq("admin_id", user.id)
        .single();
    
    // For super admin or public access logic, we might need adjustments.
    // But this function is likely called within Admin Portal context.
    // If store is null, maybe they are super admin looking at all products?
    // Or just return empty if not store admin.
    const storeId = store?.id;

    let query = supabase
        .from("products")
        .select("*, category:categories(id, name)", { count: "exact" });

    // Filter by store if admin
    if (storeId) {
        query = query.eq("store_id", storeId);
    }
    
    // Apply filters
    if (filters?.search) {
        query = query.ilike("name", `%${filters.search}%`);
    }
    if (filters?.categoryId && filters.categoryId !== "all") {
        query = query.eq("category_id", filters.categoryId);
    }
    if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to).order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
        console.error("Error fetching products:", error);
        return { data: [], total: 0 };
    }

    return {
        data: (data as any[]).map(item => ({
            ...item,
            category_id: item.category_id,
            store_id: item.store_id,
            category: item.category
        })) as Product[],
        total: count || 0,
    };
}

export async function createProduct(product: Omit<Product, "id" | "created_at" | "updated_at" | "store_id" | "category">) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data: store } = await supabase
        .from("stores")
        .select("id, status")
        .eq("admin_id", user.id)
        .single();

    if (!store) throw new Error("Store not found");
    if (store.status !== 'active') throw new Error(`Store status is ${store.status}. You cannot create products.`);


    const { data, error } = await supabase
        .from("products")
        .insert([{
            ...product,
            store_id: store.id,
            updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

    if (error) {
        console.error("Error creating product:", error);
        throw new Error("Failed to create product");
    }

    revalidatePath("/admin/products");
    return data as any as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
    const supabase = await createClient();
    
    // Updates should exclude joined fields and non-db fields
    const { category, ...cleanUpdates } = updates;
    const dbUpdates = {
        ...cleanUpdates,
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from("products")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating product:", error);
        throw new Error("Failed to update product");
    }

    revalidatePath("/admin/products");
    return data as any as Product;
}

export async function deleteProduct(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
        console.error("Error deleting product:", error);
        throw new Error("Failed to delete product");
    }

    revalidatePath("/admin/products");
}

// --- Categories ---

export async function getCategories(): Promise<Category[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: store } = await supabase
        .from("stores")
        .select("id")
        .eq("admin_id", user.id)
        .single();
    
    let query = supabase.from("categories").select("*").order("name");
    
    if (store) {
        query = query.eq("store_id", store.id);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }

    return data as Category[];
}

export async function createCategory(name: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data: store } = await supabase
        .from("stores")
        .select("id, status")
        .eq("admin_id", user.id)
        .single();

    if (!store) throw new Error("Store not found");
    if (store.status !== 'active') throw new Error(`Store status is ${store.status}. You cannot create categories.`);

    const { data, error } = await supabase
        .from("categories")
        .insert([{ name, store_id: store.id }])
        .select()
        .single();

    if (error) {
        console.error("Error creating category:", error);
        throw new Error("Failed to create category");
    }

    revalidatePath("/admin/products");
    return data as Category;
}

export async function deleteCategory(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
        console.error("Error deleting category:", error);
        throw new Error("Failed to delete category");
    }

    revalidatePath("/admin/products");
}
