"use server";

import { createClient } from "@/lib/supabase/server";
import { Product, ProductFilters, Category } from "./types";
import { revalidatePath } from "next/cache";

export async function getProducts(filters?: ProductFilters): Promise<{ data: Product[]; total: number }> {
  try {
    const supabase = await createClient();
    let query = supabase.from("products").select("*", { count: "exact" });

    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }
    if (filters?.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
    }
    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const from = (page - 1) * limit; // 0-based index
    const to = from + limit - 1; // inclusive

    query = query.range(from, to).order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }

    return {
      data: (data as unknown as Product[]) || [],
      total: count || 0,
    };
  } catch (error) {
    console.error("Error in getProducts:", error);
    // return empty array on failure if table doesn't exist yet, to prevent crash
    return { data: [], total: 0 };
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    // Assuming 'categories' table exists, or extracting distinct categories from products
    // User existing code uses a separate Category interface, suggesting a table.
    // If table doesn't exist, we might fail.
    // For now, let's try to fetch from 'categories' table.
    const { data, error } = await supabase.from("categories").select("*").order("name");

    if (error) {
      // If table doesn't exist, fallback to empty or mock?
      // Better to throw or return null so UI handles it.
      // But let's log and return empty.
      console.error("Error fetching categories:", error);
      return [];
    }
    
    return (data as unknown as Category[]) || [];
  } catch (error) {
    console.error("Error in getCategories:", error);
    return [];
  }
}

export async function createProduct(product: Omit<Product, "id" | "createdAt">) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("products")
    .insert([{
      ...product,
      // created_at is automatic usually, but let's see schema. Assuming default.
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }

  revalidatePath("/admin/products");
  return data as unknown as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }

  revalidatePath("/admin/products");
  return data as unknown as Product;
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }

  revalidatePath("/admin/products");
}
