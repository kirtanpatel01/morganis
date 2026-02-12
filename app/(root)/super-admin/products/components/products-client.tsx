"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw, FilterX } from "lucide-react"
import { toast } from "sonner"

import { ProductsTable } from "../_products/components"
import type { Product, Category } from "../_products/types"
import { useSuperAdminProducts } from "../hooks/use-super-admin-products"

interface ProductsClientProps {
    initialProducts: Product[];
    initialCategories: Category[];
    initialStoresList: { id: string; name: string }[];
}

export function ProductsClient({
    initialProducts,
    initialCategories,
    initialStoresList
}: ProductsClientProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Use connection hook
    const { products, categories, storesList, isLoading } = useSuperAdminProducts({
        initialProducts,
        initialCategories,
        initialStoresList
    });

    // Local State for filters
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
    const [storeFilter, setStoreFilter] = useState(searchParams.get("storeId") || "all")
    const [categoryFilter, setCategoryFilter] = useState(searchParams.get("categoryId") || "all")
    const [availabilityFilter, setAvailabilityFilter] = useState(searchParams.get("availability") || "all")

    // Update URL without refresh (shallow routing substitute)
    const updateUrlParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== "all" && value !== "") {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        window.history.replaceState(null, "", `${pathname}?${params.toString()}`)
    };

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStore = storeFilter === "all" || product.storeId === storeFilter;
            const matchesCategory = categoryFilter === "all" || product.categoryId === categoryFilter;
            
            let matchesAvailability = true;
            if (availabilityFilter === "available") {
                matchesAvailability = product.isAvailable;
            } else if (availabilityFilter === "unavailable") {
                matchesAvailability = !product.isAvailable;
            }

            return matchesSearch && matchesStore && matchesCategory && matchesAvailability;
        });
    }, [products, searchTerm, storeFilter, categoryFilter, availabilityFilter]);


    // Handlers
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        updateUrlParams("search", value);
    };

    const handleStoreFilterChange = (value: string) => {
        setStoreFilter(value);
        updateUrlParams("storeId", value);
    };

    const handleCategoryFilterChange = (value: string) => {
        setCategoryFilter(value);
        updateUrlParams("categoryId", value);
    };

    const handleAvailabilityFilterChange = (value: string) => {
        setAvailabilityFilter(value);
        updateUrlParams("availability", value);
    };
    
    const clearFilters = () => {
        setSearchTerm("")
        setStoreFilter("all")
        setCategoryFilter("all")
        setAvailabilityFilter("all")
        router.replace(pathname) // Clear URL params
    }

    // Active filters count check
    const activeFiltersCount = [
        storeFilter !== "all",
        categoryFilter !== "all",
        availabilityFilter !== "all",
        searchTerm !== "",
    ].filter(Boolean).length

    // Refresh handler (now just invalidates queries via hook logic if needed, or simple reload)
    // Since we have realtime, manual refresh is less critical but good for manual sync
    const handleRefresh = () => {
        // We can just trigger a router refresh to re-run server side fetch if we suspect desync
        // Or strictly rely on background revalidation. 
        // For simplicity, let's just refresh the router to get fresh server data as baseline
        toast.promise(
            new Promise((resolve) => {
                router.refresh();
                setTimeout(resolve, 500);
            }),
            {
                loading: 'Refreshing...',
                success: 'Refreshed',
                error: 'Failed to refresh'
            }
        )
    }

    return (
        <div className="flex flex-1 flex-col sm:gap-6 p-4 sm:p-6 overflow-x-hidden">
            <h1 className="text-2xl font-bold tracking-tight">Products {isLoading && <span className="text-sm font-normal text-muted-foreground ml-2">(Syncing...)</span>}</h1>
            <Card className="max-w-5xl">
                <CardHeader>
                    <CardTitle>All Products</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Filters Bar */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    className="pl-9 w-full"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleRefresh}
                                title="Refresh"
                                className="shrink-0"
                            >
                                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                            </Button>
                        </div>

                        {/* Responsive filters grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 items-center">
                            <Select value={storeFilter} onValueChange={handleStoreFilterChange}>
                                <SelectTrigger className="w-full lg:w-[200px]">
                                    <SelectValue placeholder="Filter by Store" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Stores</SelectItem>
                                    {storesList.map((store) => (
                                        <SelectItem key={store.id} value={store.id}>
                                            {store.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
                                <SelectTrigger className="w-full lg:w-[180px]">
                                    <SelectValue placeholder="Filter by Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={availabilityFilter} onValueChange={handleAvailabilityFilterChange}>
                                <SelectTrigger className="w-full lg:w-[180px]">
                                    <SelectValue placeholder="Availability" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="unavailable">Unavailable</SelectItem>
                                </SelectContent>
                            </Select>

                            {activeFiltersCount > 0 && (
                                <Button
                                    variant="ghost"
                                    onClick={clearFilters}
                                    className="h-10 px-3 text-muted-foreground hover:text-primary w-full sm:w-auto"
                                >
                                    <FilterX className="mr-2 h-4 w-4" />
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className={`rounded-md border overflow-x-auto relative transition-opacity duration-200`}>
                        <ProductsTable products={filteredProducts} />
                    </div>

                    <div className="text-sm text-muted-foreground">
                        Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
