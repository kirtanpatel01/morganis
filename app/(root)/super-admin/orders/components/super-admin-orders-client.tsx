"use client"

import { useState, useMemo, useEffect } from "react"
import { useSuperAdminOrders } from "../hooks/use-super-admin-orders"
import { Search, Store, Filter, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { OrdersTable } from "../../../admin/orders/components/orders-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SuperAdminOrdersClientProps {
    initialOrders: any[]
    initialStats: any
    initialStores: any[]
}

export function SuperAdminOrdersClient({ 
    initialOrders, 
    initialStats, 
    initialStores 
}: SuperAdminOrdersClientProps) {
    const { orders, stats, stores, isLoading } = useSuperAdminOrders({
        initialOrders,
        initialStats,
        initialStores
    })

    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [storeFilter, setStoreFilter] = useState("all")

    // Client-side filtering and searching
    const filteredOrders = useMemo(() => {
        return orders.filter((order: any) => {
            const matchesSearch = 
                order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.stores?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            
            const matchesStatus = statusFilter === "all" || order.status === statusFilter
            const matchesStore = storeFilter === "all" || order.store_id === storeFilter

            return matchesSearch && matchesStatus && matchesStore
        })
    }, [orders, searchQuery, statusFilter, storeFilter])

    // Update URL shallowly for shareability
    useEffect(() => {
        const url = new URL(window.location.href)
        if (searchQuery) url.searchParams.set("search", searchQuery)
        else url.searchParams.delete("search")
        
        if (statusFilter !== "all") url.searchParams.set("status", statusFilter)
        else url.searchParams.delete("status")
        
        if (storeFilter !== "all") url.searchParams.set("store", storeFilter)
        else url.searchParams.delete("store")

        window.history.replaceState({}, "", url.toString())
    }, [searchQuery, statusFilter, storeFilter])

    const pendingOrders = filteredOrders.filter((o: any) => o.status === 'pending')
    const activeOrders = filteredOrders.filter((o: any) => ['accepted', 'processing', 'ready', 'completed'].includes(o.status))

    return (
        <div className="flex flex-col gap-6">
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrders}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completedOrders}</div>
                    </CardContent>
                </Card>
            </div>

            <Separator />

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search orders, customers, or stores..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <div className="w-[180px]">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="accepted">Accepted</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="ready">Ready</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-[180px]">
                        <Select value={storeFilter} onValueChange={setStoreFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Stores" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Stores</SelectItem>
                                {stores.map((store: any) => (
                                    <SelectItem key={store.id} value={store.id}>
                                        {store.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All Orders ({filteredOrders.length})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
                    <TabsTrigger value="active">Active/Completed ({activeOrders.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                    <OrdersTable orders={filteredOrders} showActions={false} />
                </TabsContent>
                <TabsContent value="pending" className="mt-4">
                    <OrdersTable orders={pendingOrders} showActions={false} />
                </TabsContent>
                <TabsContent value="active" className="mt-4">
                    <OrdersTable orders={activeOrders} showActions={false} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
