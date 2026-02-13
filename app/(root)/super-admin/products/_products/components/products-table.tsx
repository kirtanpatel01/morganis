"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Product } from "../types"

interface ProductsTableProps {
    products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
    const formatPrice = (price: number) => {
        return `₹${price.toFixed(2)}`
    }

    if (products.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 border rounded-lg bg-muted/10 text-muted-foreground">
                No products found
            </div>
        )
    }

    return (
        <div className="border rounded-lg overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Store</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium whitespace-nowrap">{product.name}</TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="whitespace-nowrap">{product.categoryName}</Badge>
                            </TableCell>
                            <TableCell className="text-sm">{product.storeName}</TableCell>
                            <TableCell className="font-medium">
                                {formatPrice(product.price)} 
                                <span className="text-xs text-muted-foreground">
                                    / {product.unit || 'unit'}
                                    {product.unit_quantity && product.unit_quantity > 1 && ` (${product.unit_quantity} pcs)`}
                                </span>
                            </TableCell>
                            <TableCell>
                                {product.isAvailable ? (
                                    <Badge className="bg-green-600 hover:bg-green-700 text-white">Available</Badge>
                                ) : (
                                    <Badge variant="secondary" className="bg-gray-200 text-gray-700">Unavailable</Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
