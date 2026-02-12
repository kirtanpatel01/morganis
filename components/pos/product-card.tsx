import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Product } from "./product-data" // Assuming this type and data source needs update too if it has image
import { IconShoppingCart, IconHeart } from "@tabler/icons-react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col justify-between overflow-hidden relative group">
      {/* Removed Image Section */}
      <div className="relative w-full p-4 bg-muted/20 flex items-center justify-center min-h-[100px]">
         {/* Placeholder or just text if no image */}
         <div className="text-center">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
         </div>

        {product.isNew && (
            <Badge className="absolute top-1.5 left-1.5 h-5 px-1.5 text-[10px] bg-primary text-primary-foreground">
                New
            </Badge>
        )}
        {!product.inStock && ( // Assuming inStock is boolean
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm z-10">
                <Badge variant="destructive">Out of Stock</Badge>
            </div>
        )}
      </div>
      
      <CardContent className="flex-1 flex flex-col justify-end pt-4">
        <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold">${product.price}</span>
                {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                )}
            </div>
            <div className="flex items-center gap-0.5 text-yellow-500 text-xs">
                <span>★</span>
                <span className="text-foreground font-medium">{product.rating}</span>
            </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 w-full">
         <Button size="sm" className="w-full flex-1 gap-1.5 h-8 text-xs" disabled={!product.inStock}>
            <IconShoppingCart className="w-3.5 h-3.5" />
            Add
         </Button>
         <Button variant="outline" size="icon" className="h-8 w-8 shrink-0">
            <IconHeart className="w-3.5 h-3.5" />
            <span className="sr-only">Wishlist</span>
         </Button>
      </CardFooter>
    </Card>
  )
}
