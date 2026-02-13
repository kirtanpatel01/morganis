"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { IconFilter } from "@tabler/icons-react"
import Link from "next/link"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    selectedCategories?: string[];
    onCategoryChange?: (category: string) => void;
    priceRange?: [number, number];
    onPriceChange?: (val: number[]) => void;
    inStock?: boolean;
    onInStockChange?: (checked: boolean) => void;
    isNew?: boolean;
    onIsNewChange?: (checked: boolean) => void;
    onReset?: () => void;
    categories?: string[];
    stores?: string[];
    selectedStores?: string[];
    onStoreChange?: (store: string) => void;
}

export function PosSidebar({
    className,
    selectedCategories = [],
    onCategoryChange,
    priceRange = [0, 500],
    onPriceChange,
    inStock = false,
    onInStockChange,
    isNew = false,
    onIsNewChange,
    onReset,
    categories = [],
    stores = [],
    selectedStores = [],
    onStoreChange
}: SidebarProps) {
    const [localPriceRange, setLocalPriceRange] = React.useState(priceRange)

    React.useEffect(() => {
        setLocalPriceRange(priceRange)
    }, [priceRange])

    const handlePriceChange = (val: number[]) => {
        setLocalPriceRange(val as [number, number])
    }

    const handlePriceCommit = (val: number[]) => {
        onPriceChange?.(val)
    }

    // Handlers needed for checkboxes because Shadcn Checkbox uses onCheckedChange -> boolean
    const handleCategoryToggle = (category: string) => {
        onCategoryChange?.(category);
    }

    const handleInStockToggle = (checked: boolean) => {
        onInStockChange?.(checked);
    }


    const handleIsNewToggle = (checked: boolean) => {
        onIsNewChange?.(checked);
    }

    const handleStoreToggle = (store: string) => {
        onStoreChange?.(store);
    }


    return (
        <div className={cn("flex flex-col h-full border-r border-border bg-background", className)}>
            <div className="space-y-4 py-4 flex-1 overflow-y-auto w-full">
                <div className="">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight flex items-center gap-2">
                        <IconFilter className="w-5 h-5" />
                        Filters
                        {onReset && (
                            <Button variant="ghost" size="sm" onClick={onReset} className="ml-auto h-auto p-1 text-xs">
                                Reset
                            </Button>
                        )}
                    </h2>
                    <Separator className="my-4" />
                    <div className="space-y-1">
                        <h3 className="mb-2 px-4 text-sm font-medium text-muted-foreground">Categories</h3>
                        <div className="px-4 space-y-2">
                            {categories.map((category) => (
                                <div key={category} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`category-${category}`}
                                        checked={selectedCategories.includes(category)}
                                        onCheckedChange={() => handleCategoryToggle(category)}
                                    />
                                    <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {category}
                                    </Label>
                                </div>
                            ))}
                            {categories.length === 0 && (
                                <p className="text-sm text-muted-foreground px-2">No categories found</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="">
                    <h3 className="mb-2 px-4 text-sm font-medium text-muted-foreground mt-4">Stores</h3>
                    <div className="px-4 space-y-2">
                        {stores.map((store) => (
                            <div key={store} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`store-${store}`}
                                    checked={selectedStores.includes(store)}
                                    onCheckedChange={() => handleStoreToggle(store)}
                                />
                                <Label htmlFor={`store-${store}`} className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {store}
                                </Label>
                            </div>
                        ))}
                         {stores.length === 0 && (
                            <p className="text-sm text-muted-foreground px-2">No stores found</p>
                        )}
                    </div>
                </div>

                <div className="px-3 py-2">
                    <h3 className="mb-2 px-4 text-sm font-medium text-muted-foreground">Price Range</h3>
                    <div className="px-4 pt-4">
                        <Slider
                            value={localPriceRange}
                            max={1000}
                            step={10}
                            className="w-full"
                            onValueChange={handlePriceChange}
                            onValueCommit={handlePriceCommit}
                        />
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>${localPriceRange[0]}</span>
                            <span>${localPriceRange[1]}+</span>
                        </div>
                    </div>
                </div>

                <div className="px-3 py-2">
                    <h3 className="mb-2 px-4 text-sm font-medium text-muted-foreground">Availability</h3>
                    <div className="px-4 space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="instock" checked={inStock} onCheckedChange={handleInStockToggle} />
                            <Label htmlFor="instock" className="font-normal cursor-pointer">In Stock Only</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="newarrival" checked={isNew} onCheckedChange={handleIsNewToggle} />
                            <Label htmlFor="newarrival" className="font-normal cursor-pointer">New Arrivals</Label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t sticky bottom-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 w-full">
                <Link href="/auth/admin-login" className="block w-full">
                    <Button className="w-full cursor-pointer">
                        Admin Login
                    </Button>
                </Link>
            </div>
        </div>
    )
}
