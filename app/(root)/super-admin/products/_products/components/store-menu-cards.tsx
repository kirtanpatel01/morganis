"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Store, Package } from "lucide-react"
import type { StoreMenu } from "../types"

interface StoreMenuCardsProps {
    storeMenus: StoreMenu[]
    onSelectStore: (storeId: string) => void
    selectedStoreId?: string
}

export function StoreMenuCards({ storeMenus, onSelectStore, selectedStoreId }: StoreMenuCardsProps) {
    if (storeMenus.length === 0) {
        return <div className="text-muted-foreground text-sm">No store menus found.</div>
    }

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {storeMenus.map((menu) => (
                <Card
                    key={menu.storeId}
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedStoreId === menu.storeId ? "ring-2 ring-primary" : ""
                        }`}
                    onClick={() => onSelectStore(menu.storeId)}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium truncate pr-2">{menu.storeName}</CardTitle>
                        <Store className="h-4 w-4 text-muted-foreground shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 mb-3">
                            <Package className="h-5 w-5 text-primary" />
                            <span className="text-2xl font-bold">{menu.totalProducts}</span>
                            <span className="text-sm text-muted-foreground">products</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {menu.categories.slice(0, 3).map((category) => (
                                <Badge key={category.id} variant="secondary" className="text-xs">
                                    {category.name}
                                </Badge>
                            ))}
                            {menu.categories.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{menu.categories.length - 3} more
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
