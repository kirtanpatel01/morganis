"use client";

import { useState } from "react";
import { ProductTable } from "./product-table";
import { CategoryManager } from "./category-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateProductDialog } from "./create-product-dialog";
import { UpdateProductDialog } from "./update-product-dialog";
import { DeleteProductDialog } from "./delete-product-dialog";
import { Product } from "../types";

export function ProductsClient() {
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [deletingProduct, setDeletingProduct] = useState<Product | undefined>(undefined);

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">All Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="space-y-4">
          <ProductTable 
            action={<CreateProductDialog />}
            onEdit={(product) => setEditingProduct(product)}
            onDelete={(product) => setDeletingProduct(product)}
          />
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <CategoryManager />
        </TabsContent>
      </Tabs>

      <UpdateProductDialog 
        product={editingProduct}
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(undefined)}
      />

      <DeleteProductDialog 
        product={deletingProduct}
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(undefined)}
      />
    </div>
  );
}
