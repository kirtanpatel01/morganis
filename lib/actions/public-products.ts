"use server";

import { createClient } from "@/lib/supabase/server";

export async function getPublicProducts() {
    const supabase = await createClient();
    
    // Fetch products where the associated store is active
    // Supabase filtering on joined tables: !inner implies standard join which filters rows where relation exists
    // To filter by joined table column: .eq('stores.status', 'active')
    
    const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(id, name), store:stores!inner(status)") 
        .eq("stores.status", "active") // Filter by active stores
        .eq("status", "active") // Filter by active products
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching public products:", error);
        return [];
    }

    return (data || []).map(p => ({
        id: p.id,
        name: p.name,
        category: p.category?.name || "Uncategorized",
        price: p.price,
        originalPrice: p.price * 1.2, // Mock original price, can be removed if not needed in UI
        rating: 4.5, // Mock
        reviews: 0, // Mock
        inStock: p.stock > 0,
        isNew: new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // New if < 7 days
        description: p.description
    }));
}

export async function getPublicCategories() {
    const supabase = await createClient();
    
    // Fetch categories where the associated store is active
    const { data, error } = await supabase
        .from("categories")
        .select("name, store:stores!inner(status)")
        .eq("stores.status", "active")
        .order("name");
    
    if (error) return [];
    
    // Return unique category names
    const names = data.map((c: any) => c.name);
    return ["All", ...Array.from(new Set(names))];
}
