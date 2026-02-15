"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search } from "lucide-react";
import { useProducts, useCategories } from "../hooks/use-products";
import { Product, Category } from "../types";

interface ProductTableProps {
    initialCategories: Category[];
    onEdit?: (product: Product) => void;
    onDelete?: (product: Product) => void;
    action?: React.ReactNode;
    storeStatus?: string;
}

export function ProductTable({ initialCategories, onEdit, onDelete, action, storeStatus }: ProductTableProps) {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const isActive = storeStatus === 'active';

    const { data: productsData, isLoading } = useProducts({
        filters: {
            search,
            categoryId: categoryFilter === "all" ? undefined : categoryFilter,
            page,
            limit: pageSize,
        },
        initialData: undefined // Always fetch fresh data on client to ensure sync with pagination/filters
    });
    
    // We can use useCategories here too if we want to ensure it's fresh, but passed prop is fine for initial list.
    const { data: categories } = useCategories(initialCategories);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    }

    const handleCategoryChange = (val: string) => {
        setCategoryFilter(val);
        setPage(1);
    }

    // if (isLoading) return <div>Loading products...</div>; // Don't block UI on loading, show table skeleton or spinner inside

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            value={search}
                            onChange={handleSearch}
                            className="pl-8 w-full sm:w-[250px]"
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories?.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full sm:w-auto flex justify-end">
                    {action}
                </div>
            </div>

            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[150px]">Name</TableHead>
                            <TableHead className="min-w-[120px]">Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productsData?.data.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium whitespace-nowrap">{product.name}</TableCell>
                                <TableCell className="whitespace-nowrap">{product.category?.name || "Uncategorized"}</TableCell>
                                <TableCell>₹{product.price.toFixed(2)}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>
                                    <Badge variant={product.status === "active" ? "default" : "secondary"}>
                                        {product.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={!isActive}>
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => onEdit?.(product)} disabled={!isActive}>
                                                Edit { !isActive && "(Store Inactive)" }
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() => onDelete?.(product)}
                                                disabled={!isActive}
                                            >
                                                Delete { !isActive && "(Store Inactive)" }
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {productsData?.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                    Showing {productsData?.data.length || 0} of {productsData?.total || 0} products
                </div>
                <div className="space-x-2 order-1 sm:order-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || isLoading}
                    >
                        Previous
                    </Button>
                    <span className="text-sm font-medium mx-2">
                        Page {page} of {Math.ceil((productsData?.total || 0) / pageSize) || 1}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => p + 1)}
                        disabled={!productsData || page >= Math.ceil(productsData.total / pageSize) || isLoading}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
