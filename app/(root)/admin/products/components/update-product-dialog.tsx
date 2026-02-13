"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "./product-form";
import { Product } from "../types";

interface UpdateProductDialogProps {
  product: Product | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taxRate: number;
}

export function UpdateProductDialog({
  product,
  open,
  onOpenChange,
  taxRate,
}: UpdateProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to the product here.
          </DialogDescription>
        </DialogHeader>
        {product && (
          <ProductForm
            initialData={product}
            onSuccess={() => onOpenChange(false)}
            taxRate={taxRate}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
