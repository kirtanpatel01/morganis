"use client"

import { useState } from "react"
import { useOrders } from "../hooks/use-orders"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Database } from "../../../../../types/supabase"
import { OrdersTable } from "./orders-table"

type Order = Database["public"]["Tables"]["orders"]["Row"] & {
    order_items: Database["public"]["Tables"]["order_items"]["Row"][]
}

interface OrdersClientProps {
    initialData: Order[]
}

export function OrdersClient({ initialData }: OrdersClientProps) {
    const { orders, isLoading, error } = useOrders(initialData)
    const [searchQuery, setSearchQuery] = useState("")

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading orders...</div>
    }

    if (error) {
        return <div className="p-8 text-center text-destructive">Error loading orders.</div>
    }

    const safeOrders = orders || []

    // Filter logic
    const filteredOrders = safeOrders.filter((order) => {
        const matchesSearch = 
            order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
    })

    const pendingOrders = filteredOrders.filter(o => o.status === 'pending')
    const activeOrders = filteredOrders.filter(o => ['accepted', 'processing', 'ready'].includes(o.status))
    const historyOrders = filteredOrders.filter(o => ['completed', 'rejected', 'cancelled'].includes(o.status))

    return (
        <div className="flex flex-col gap-4 p-0 md:p-0 h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="pending" className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="w-full md:w-fit justify-start md:justify-center overflow-x-auto">
                    <TabsTrigger value="pending" className="relative">
                        Pending
                        {pendingOrders.length > 0 && (
                            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                {pendingOrders.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-auto mt-4 border rounded-md">
                    <TabsContent value="pending" className="h-full mt-0">
                        <OrdersTable orders={pendingOrders} showActions={true} />
                    </TabsContent>
                    <TabsContent value="active" className="h-full mt-0">
                        <OrdersTable orders={activeOrders} showActions={true} />
                    </TabsContent>
                    <TabsContent value="history" className="h-full mt-0">
                        <OrdersTable orders={historyOrders} showActions={false} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
