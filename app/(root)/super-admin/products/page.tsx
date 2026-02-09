"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw, FilterX } from "lucide-react"
import { toast } from "sonner"

import { ProductsTable, StoreMenuCards } from "./_products/components"
import { getProducts, getAllStoreMenus, getCategories, getStoresList } from "./_products/actions"
import type { Product, StoreMenu, Category, ProductFilters } from "./_products/types"

export default function ProductsPage() {
    // Data states
    const [products, setProducts] = useState<Product[]>([])
    const [storeMenus, setStoreMenus] = useState<StoreMenu[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [storesList, setStoresList] = useState<{ id: string; name: string }[]>([])

    // UI states
    const [loading, setLoading] = useState(true)
    const [productsLoading, setProductsLoading] = useState(false)
    const [filters, setFilters] = useState<ProductFilters>({
        search: "",
        storeId: "all",
        categoryId: "all",
        availability: "all",
    })

    // Initial data fetch
    useEffect(() => {
        async function initData() {
            try {
                const [menus, cats, stores] = await Promise.all([
                    getAllStoreMenus(),
                    getCategories(),
                    getStoresList(),
                ])
                setStoreMenus(menus)
                setCategories(cats)
                setStoresList(stores)
            } catch (error) {
                console.error("Failed to load initial data:", error)
                toast.error("Failed to load page data")
            }
        }
        initData()
    }, [])

    // Fetch products when filters change
    const fetchProducts = useCallback(async () => {
        setProductsLoading(true)
        try {
            const data = await getProducts(filters)
            setProducts(data)
        } catch (error) {
            console.error("Failed to fetch products:", error)
            toast.error("Failed to load products")
        } finally {
            setProductsLoading(false)
            setLoading(false) // Main loading done after first product fetch
        }
    }, [filters])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    // Handlers
    const handleStoreSelect = (storeId: string) => {
        setFilters((prev) => ({ ...prev, storeId: storeId === prev.storeId ? "all" : storeId }))
    }

    const handleSearchChange = (value: string) => {
        setFilters((prev) => ({ ...prev, search: value }))
    }

    const handleStoreFilterChange = (value: string) => {
        setFilters((prev) => ({ ...prev, storeId: value }))
    }

    const handleCategoryFilterChange = (value: string) => {
        setFilters((prev) => ({ ...prev, categoryId: value }))
    }

    const handleAvailabilityFilterChange = (value: string) => {
        setFilters((prev) => ({ ...prev, availability: value as ProductFilters["availability"] }))
    }

    const clearFilters = () => {
        setFilters({
            search: "",
            storeId: "all",
            categoryId: "all",
            availability: "all",
        })
    }

    // Derived state for active filters count
    const activeFiltersCount = [
        filters.storeId !== "all",
        filters.categoryId !== "all",
        filters.availability !== "all",
        filters.search !== "",
    ].filter(Boolean).length

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="text-muted-foreground">Loading products...</div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Products & Menus</h1>
                    <p className="text-muted-foreground">
                        Manage products and view menus across all stores
                    </p>
                </div>
            </div>

            {/* Store Overview Cards */}
            <section className="space-y-3">
                <h2 className="text-lg font-semibold">Store Menus Overview</h2>
                <StoreMenuCards
                    storeMenus={storeMenus}
                    onSelectStore={handleStoreSelect}
                    selectedStoreId={filters.storeId !== "all" ? filters.storeId : undefined}
                />
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>All Products</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Filters Bar */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    className="pl-9"
                                    value={filters.search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={fetchProducts}
                                disabled={productsLoading}
                                title="Refresh"
                            >
                                <RefreshCw className={`h-4 w-4 ${productsLoading ? "animate-spin" : ""}`} />
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 items-center">
                            <Select value={filters.storeId} onValueChange={handleStoreFilterChange}>
                                <SelectTrigger className="w-[200px]">
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

                            <Select value={filters.categoryId} onValueChange={handleCategoryFilterChange}>
                                <SelectTrigger className="w-[180px]">
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

                            <Select value={filters.availability} onValueChange={handleAvailabilityFilterChange}>
                                <SelectTrigger className="w-[180px]">
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
                                    className="h-10 px-3 text-muted-foreground hover:text-primary"
                                >
                                    <FilterX className="mr-2 h-4 w-4" />
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Products Table */}
                    {productsLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-muted-foreground">Updating products...</div>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <ProductsTable products={products} />
                        </div>
                    )}

                    <div className="text-sm text-muted-foreground">
                        Showing {products.length} product{products.length !== 1 ? "s" : ""}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
