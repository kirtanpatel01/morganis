"use server"

import { createClient } from "@/lib/supabase/server"
import type { Product, Category, StoreMenu, ProductFilters } from "./types"

/**
 * Get all stores for dropdown
 */
export async function getStoresList(): Promise<{ id: string; name: string }[]> {
    const supabase = await createClient()
    const { data } = await supabase.from("stores").select("id, name").order("name")
    return (data as any) || []
}

/**
 * Get all categories (unique across all stores or just list)
 */
export async function getCategories(): Promise<Category[]> {
    const supabase = await createClient()
    const { data } = await supabase.from("categories").select("id, name").order("name")
    return (data as any) || []
}

/**
 * Get products with filters
 */
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
    const supabase = await createClient()
    
    let query = supabase
        .from("products")
        .select(`
            *,
            store:stores(id, name),
            category:categories(id, name)
        `)
        .order("created_at", { ascending: false })

    if (filters?.storeId && filters.storeId !== "all") {
        query = query.eq("store_id", filters.storeId)
    }

    if (filters?.categoryId && filters.categoryId !== "all") {
        query = query.eq("category_id", filters.categoryId)
    }

    if (filters?.search) {
        query = query.ilike("name", `%${filters.search}%`)
    }

    if (filters?.availability && filters.availability !== "all") {
        const isActive = filters.availability === "available"
        if (isActive) {
             query = query.eq("status", "active")
        } else {
             query = query.neq("status", "active")
        }
    }

    const { data, error } = await query

    if (error) {
        console.error("Error fetching products:", error)
        return []
    }

    return (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        price: p.price,
        categoryId: p.category_id,
        categoryName: p.category?.name || "Uncategorized",
        storeId: p.store_id,
        storeName: p.store?.name || "Unknown Store",
        isAvailable: p.status === "active" && p.stock > 0,
        createdAt: p.created_at
    }))
}

export async function getAllStoreMenus(): Promise<StoreMenu[]> {
    const supabase = await createClient()

    // Fetch stores
    const { data: stores } = await supabase.from("stores").select("id, name").order("name")
    if (!stores) return []

    // Fetch products with categories for each store (can be optimized)
    // Or fetch all products and group by store
    const { data: allProducts } = await supabase
        .from("products")
        .select(`
            *,
            category:categories(id, name)
        `)
        .eq("status", "active") // Assume menus only show active? Or all? Let's show all for admin.
    
    if (!allProducts) return []

    return stores.map(store => {
        const storeProducts = allProducts.filter((p: any) => p.store_id === store.id)
        
        // Extract unique categories
        const categoriesMap = new Map()
        storeProducts.forEach((p: any) => {
            if (p.category) {
                categoriesMap.set(p.category.id, p.category)
            }
        })
        const storeCategories = Array.from(categoriesMap.values())

        const mappedProducts: Product[] = storeProducts.map((p: any) => ({
             id: p.id,
             name: p.name,
             description: p.description || "",
             price: p.price,
             categoryId: p.category_id,
             categoryName: p.category?.name || "Uncategorized",
             storeId: p.store_id,
             storeName: store.name,
             isAvailable: p.status === "active" && p.stock > 0,
             createdAt: p.created_at
        }))

        return {
            storeId: store.id,
            storeName: store.name,
            categories: storeCategories,
            products: mappedProducts,
            totalProducts: mappedProducts.length
        }
    })
}
