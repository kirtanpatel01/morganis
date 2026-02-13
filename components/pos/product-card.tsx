"use client"

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Product } from "./product-data"
import { IconShoppingCart, IconHeart } from "@tabler/icons-react"

import { useCartStore } from "./cart-store"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <Card>
      <CardContent className="flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2" title={product.name}>
              {product.name}
            </h3>
            {product.storeName && (
                <p className="text-xs text-muted-foreground truncate" title={product.storeName}>
                    {product.storeName}
                </p>
            )}
          </div>
          <Badge variant="outline" className="shrink-0 font-normal text-[10px] px-1.5 h-5">
            {product.category}
          </Badge>
        </div>

        {!product.inStock && (
          <div className="mt-1">
            <Badge variant="destructive" className="text-[10px] h-5 px-1.5 shadow-none">Out of Stock</Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <span className="text-base font-bold">
          ${product.price}
          <span className="text-xs font-normal text-muted-foreground">
             / {product.unit || 'unit'}
             {product.unit_quantity && Number(product.unit_quantity) > 1 && ` (${product.unit_quantity} pcs)`}
          </span>
        </span>
        <Button 
            size="sm" 
            disabled={!product.inStock} 
            className="cursor-pointer"
            onClick={() => addItem(product)}
        >
          <IconShoppingCart />
          Add
        </Button>
      </CardFooter>
    </Card>
  )
}
