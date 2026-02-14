"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductForm } from "./product-form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CreateProductDialogProps {
    storeStatus?: string;
    taxRate: number;
}

export function CreateProductDialog({ storeStatus, taxRate }: CreateProductDialogProps) {
  const [open, setOpen] = useState(false);
  const isActive = storeStatus === 'active';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-block"> {/* Wrap in div to support disabled button tooltip */}
               <DialogTrigger asChild>
                <Button disabled={!isActive}>
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
               </DialogTrigger>
            </div>
          </TooltipTrigger>
          {!isActive && (
              <TooltipContent>
                <p>You cannot create products because the store status is {storeStatus}.</p>
              </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>
            Add a new product to your inventory.
          </DialogDescription>
        </DialogHeader>
        <ProductForm onSuccess={() => setOpen(false)} taxRate={taxRate} />
      </DialogContent>
    </Dialog>
  );
}
