"use server";

import { supabaseAdminAuth } from "@/lib/supabase/auth-admin";
import { createClient } from "@/lib/supabase/server";

export type ActiveStore = {
  id: string;
  name: string | null;
  address: string | null;
  category_names: string[];
  owner_name?: string;
};

export async function getActiveStores(): Promise<ActiveStore[]> {
  const supabase = await createClient();

  try {
    // 1. Fetch active stores
    const { data: stores, error } = await supabase
      .schema("public")
      .from("stores")
      .select("*, categories(name)")
      .eq("status", "active");

    if (error) {
      console.error("Failed to fetch active stores:", error);
      return [];
    }

    if (!stores) return [];

    // 2. Fetch owner names using Admin Auth (Sanitized)
    const enrichedStores = await Promise.all(
      stores.map(async (store) => {
        let ownerName = "Unknown";
        
        if (store.admin_id) {
          try {
            const { data: userData, error: userError } = await supabaseAdminAuth.auth.admin.getUserById(store.admin_id);
            
            if (!userError && userData.user) {
              ownerName = userData.user.user_metadata?.name || "Unknown";
            }
          } catch (err) {
            console.error(`Failed to fetch owner for store ${store.id}`, err);
          }
        }

        return {
          id: store.id,
          name: store.name,
          address: store.address,
          category_names: store.categories 
            ? (Array.isArray(store.categories) 
                ? store.categories.map((c: any) => c.name) 
                : [store.categories.name])
            : [],
          owner_name: ownerName,
        };
      })
    );

    return enrichedStores;
  } catch (error) {
    console.error("Unexpected error fetching active stores:", error);
    return [];
  }
}
