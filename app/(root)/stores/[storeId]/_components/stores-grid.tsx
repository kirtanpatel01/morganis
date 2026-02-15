"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { ActiveStore, getActiveStores } from "../../actions";
import { StoreCard } from "./store-card";

// --- Custom Hook ---
function useActiveStores(initialData: ActiveStore[]) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const { data } = useQuery({
    queryKey: ["active-stores"],
    queryFn: async () => await getActiveStores(),
    initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    const channel = supabase
      .channel("active-stores-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "stores" },
        (payload: { [key: string]: any }) => {
            // Invalidate to refetch fresh data (including owner names if we could, 
            // but owner names come from separate fetch. 
            // Since we fetch everything in getActiveStores, invalidating is correct.)
          console.log("Realtime update:", payload);
          queryClient.invalidateQueries({ queryKey: ["active-stores"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabase]);

  return data;
}

// --- Component ---
interface StoresGridProps {
  initialData: ActiveStore[];
}

export function StoresGrid({ initialData }: StoresGridProps) {
  const stores = useActiveStores(initialData);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // Client-side filtering
  const filteredStores = useMemo(() => {
    if (!stores) return [];
    if (!searchQuery) return stores;

    return stores.filter((store) => {
      return (
        store.name?.toLowerCase().includes(searchQuery) ||
        store.owner_name?.toLowerCase().includes(searchQuery) ||
        store.address?.toLowerCase().includes(searchQuery) ||
        store.category_names.some((cat) => cat.toLowerCase().includes(searchQuery))
      );
    });
  }, [stores, searchQuery]);

  return (
    <div className="p-4 sm:p-6">
       {filteredStores.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-2xl font-bold tracking-tight text-foreground/80">
                {searchQuery ? "No stores found matching your search" : "No active stores available"}
            </h3>
            <p className="mt-2 text-muted-foreground">
                {searchQuery ? "Try checking for typos or using broader terms." : "Please check back later."}
            </p>
         </div>
       ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStores.map((store) => (
            <StoreCard key={store.id} store={store} />
            ))}
        </div>
       )}
    </div>
  );
}
