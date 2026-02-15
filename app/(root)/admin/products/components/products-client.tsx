"use client";

import { useState, useEffect, useRef } from "react";
import { ProductTable } from "./product-table";
import { CategoryManager } from "./category-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateProductDialog } from "./create-product-dialog";
import { UpdateProductDialog } from "./update-product-dialog";
import { DeleteProductDialog } from "./delete-product-dialog";
import { Product, Category } from "../types";
import { useRealtimeProducts } from "../hooks/use-products";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ProductsClientProps {
  initialProducts: { data: Product[]; total: number };
  initialCategories: Category[];
  initialStoreStatus: string;
  storeId?: string;
  taxRate: number;
}

export function ProductsClient({ initialProducts, initialCategories, initialStoreStatus, storeId, taxRate }: ProductsClientProps) {
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [deletingProduct, setDeletingProduct] = useState<Product | undefined>(undefined);
  const [storeStatus, setStoreStatus] = useState(initialStoreStatus);
  const statusRef = useRef(storeStatus);

  useEffect(() => {
    statusRef.current = storeStatus;
  }, [storeStatus]);

  // Listen for realtime updates including store status
  useRealtimeProducts();

  useEffect(() => {
    if (!storeId) return;

    const supabase = createClient();
    console.log(`Subscribing to store-status update for storeId: ${storeId}`);

    const channel = supabase.channel(`store-status-${storeId}`)
        .on(
            'postgres_changes',
            { 
               event: 'UPDATE', 
               schema: 'public', 
               table: 'stores', 
               filter: `id=eq.${storeId}` 
            },
            (payload: { [key: string]: any }) => {
                console.log("Realtime store UPDATE received:", payload);
                const newData = payload.new as { status?: string };
                if (newData && newData.status) {
                    const newStatus = newData.status;
                    const oldStatus = statusRef.current; // Use ref to compare without rebuilding effect
                    
                    setStoreStatus(newStatus);
                    
                    if (newStatus !== oldStatus) {
                        toast.info(`Store status updated to ${newStatus}`);
                    }
                }
            }
        )
        .subscribe((status: string) => {
            console.log(`Store subscription status: ${status}`);
        });
    
    return () => {
        console.log("Unsubscribing from store status");
        supabase.removeChannel(channel);
    }
  }, [storeId]);
  
  // Update state when initial prop changes (e.g. router reload)
  useEffect(() => {
     setStoreStatus(initialStoreStatus);
  }, [initialStoreStatus]);


  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        {storeStatus !== 'active' && (
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm font-medium border border-yellow-200">
                Store is {storeStatus}. You cannot manage products.
            </div>
        )}
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">All Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="space-y-4">
          <ProductTable 
            initialCategories={initialCategories}
            action={<CreateProductDialog storeStatus={storeStatus} taxRate={taxRate} />}
            onEdit={(product) => setEditingProduct(product)}
            onDelete={(product) => setDeletingProduct(product)}
            storeStatus={storeStatus}
          />
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <CategoryManager initialData={initialCategories} storeStatus={storeStatus} />
        </TabsContent>
      </Tabs>

      <UpdateProductDialog 
        product={editingProduct}
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(undefined)}
        taxRate={taxRate}
      />

      <DeleteProductDialog 
        product={deletingProduct}
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(undefined)}
      />
    </div>
  );
}
