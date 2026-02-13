import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Product } from "./product-data"
import { IconShoppingCart, IconHeart } from "@tabler/icons-react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardContent className="flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider truncate">{product.category}</p>
            <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2" title={product.name}>
              {product.name}
            </h3>
          </div>
          {product.isNew && (
            <Badge variant="secondary">New</Badge>
          )}
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
        <Button size="sm" disabled={!product.inStock} className="cursor-pointer">
          <IconShoppingCart />
          Add
        </Button>
      </CardFooter>
    </Card>
  )
}
