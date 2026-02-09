"use client"

import { useState } from "react"
import { PosSidebar } from "./pos-sidebar"
import { ProductCard } from "./product-card"
import { products } from "./product-data"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconSearch, IconSortAscending, IconAdjustmentsHorizontal } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { PosFooter } from "./pos-footer"

export function ProductBrowser() {
    const [searchQuery, setSearchQuery] = useState("")
    const [sortOption, setSortOption] = useState("featured")
    
    // Filter states
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000])
    const [inStock, setInStock] = useState(false)
    const [isNew, setIsNew] = useState(false)

    // Handlers
    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
        )
    }

    const handleReset = () => {
        setSearchQuery("")
        setSortOption("featured")
        setSelectedCategories([])
        setPriceRange([0, 1000])
        setInStock(false)
        setIsNew(false)
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.category.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
        const matchesStock = !inStock || product.inStock
        const matchesNew = !isNew || product.isNew

        return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesNew
    }).sort((a, b) => {
        if (sortOption === "price-asc") return a.price - b.price
        if (sortOption === "price-desc") return b.price - a.price
        if (sortOption === "rating") return b.rating - a.rating
        if (sortOption === "newest") return (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1
        return 0
    })

    const SidebarWithProps = (props: { className?: string }) => (
        <PosSidebar 
            className={props.className}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            priceRange={[priceRange[0], priceRange[1]]}
            onPriceChange={setPriceRange}
            inStock={inStock}
            onInStockChange={setInStock}
            isNew={isNew}
            onIsNewChange={setIsNew}
            onReset={handleReset}
        />
    )

    return (
        <div className="flex flex-1 overflow-hidden">
             <aside className="hidden w-64 flex-col border-r bg-background md:flex overflow-y-auto">
                <SidebarWithProps className="h-full" />
             </aside>
             <main className="relative flex flex-1 flex-col h-full bg-muted/50 overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 bg-background border-b gap-3 md:gap-4">
                    <div className="relative w-full md:flex-1 md:max-w-md">
                        <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="pl-8 bg-muted/50 focus-visible:bg-background transition-colors w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="md:hidden flex-1 md:flex-none">
                                    <IconAdjustmentsHorizontal className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px] pr-0">
                                <SidebarWithProps />
                            </SheetContent>
                        </Sheet>
                        <Select value={sortOption} onValueChange={setSortOption}>
                            <SelectTrigger className="w-full md:w-[160px] h-9 flex-1 md:flex-none">
                                <div className="flex items-center gap-2">
                                    <IconSortAscending className="h-4 w-4" />
                                    <span className="truncate">{sortOption === 'featured' ? 'Sort by' : 'Sort'}</span>
                                </div>
                            </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="featured">Featured</SelectItem>
                                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                <SelectItem value="rating">Top Rated</SelectItem>
                                <SelectItem value="newest">Newest Arrivals</SelectItem>
                             </SelectContent>
                        </Select>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 lg:p-6">
                        <div className="pt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        {filteredProducts.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="bg-muted rounded-full p-4 mb-4">
                                    <IconSearch className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">No products found</h3>
                                <p className="text-muted-foreground mt-1 max-w-xs mx-auto">
                                    We couldn't find any products matching your search criteria. Try adjusting your filters.
                                </p>
                                <Button variant="link" onClick={handleReset} className="mt-4">
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </div>
                    <PosFooter />
                </div>
             </main>
        </div>
    )
}
