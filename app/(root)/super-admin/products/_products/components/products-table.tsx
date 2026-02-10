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
            <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">No products found</p>
            </div>
        )
    }

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Store</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="text-muted-foreground max-w-[250px] truncate">
                                {product.description}
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary">{product.categoryName}</Badge>
                            </TableCell>
                            <TableCell className="text-sm">{product.storeName}</TableCell>
                            <TableCell className="text-right font-medium">
                                {formatPrice(product.price)}
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
