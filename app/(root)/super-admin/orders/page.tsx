"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw, FilterX, Download } from "lucide-react"
import { toast } from "sonner"

import { OrderStatsCards, OrdersTable, StorePerformanceTable } from "./_orders/components"
import { getOrders, getOrderStats, getStorePerformanceStats, getStoresList } from "./_orders/actions"
import type { Order, OrderFilters, DashboardOrderStats, StoreOrderStats } from "./_orders/types"

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [stats, setStats] = useState<DashboardOrderStats | null>(null)
    const [performance, setPerformance] = useState<StoreOrderStats[]>([])
    const [storesList, setStoresList] = useState<{ id: string; name: string }[]>([])

    const [loading, setLoading] = useState(true)
    const [ordersLoading, setOrdersLoading] = useState(false)
    const [filters, setFilters] = useState<OrderFilters>({
        search: "",
        status: "all",
        storeId: "all",
    })

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [statsData, performanceData, storesData] = await Promise.all([
                getOrderStats(),
                getStorePerformanceStats(),
                getStoresList(),
            ])
            setStats(statsData)
            setPerformance(performanceData)
            setStoresList(storesData)
        } catch (error) {
            console.error("Failed to fetch initial data:", error)
            toast.error("Failed to load dashboard data")
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchOrders = useCallback(async () => {
        setOrdersLoading(true)
        try {
            const data = await getOrders(filters)
            setOrders(data)
        } catch (error) {
            console.error("Failed to fetch orders:", error)
            toast.error("Failed to load orders")
        } finally {
            setOrdersLoading(false)
        }
    }, [filters])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        fetchOrders()
    }, [fetchOrders])

    const handleSearchChange = (value: string) => {
        setFilters((prev) => ({ ...prev, search: value }))
    }

    const handleStatusFilterChange = (value: string) => {
        setFilters((prev) => ({ ...prev, status: value as OrderFilters["status"] }))
    }

    const handleStoreFilterChange = (value: string) => {
        setFilters((prev) => ({ ...prev, storeId: value }))
    }

    const clearFilters = () => {
        setFilters({
            search: "",
            status: "all",
            storeId: "all",
        })
    }

    const activeFiltersCount = [
        filters.status !== "all",
        filters.storeId !== "all",
        filters.search !== "",
    ].filter(Boolean).length

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading order management...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Order Tracking & Reports</h1>
                    <p className="text-muted-foreground">
                        Monitor store performance and track all orders across the platform
                    </p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Reports
                </Button>
            </div>

            {/* Aggregate Stats */}
            {stats && <OrderStatsCards stats={stats} />}

            {/* Store Performance Section */}
            <StorePerformanceTable stats={performance} />

            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Filters Bar */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by Order ID, Customer Name or Email..."
                                    className="pl-9"
                                    value={filters.search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={fetchOrders}
                                disabled={ordersLoading}
                                title="Refresh Orders"
                            >
                                <RefreshCw className={`h-4 w-4 ${ordersLoading ? "animate-spin" : ""}`} />
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 items-center">
                            <Select value={filters.storeId} onValueChange={handleStoreFilterChange}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="All Stores" />
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

                            <Select value={filters.status} onValueChange={handleStatusFilterChange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Every Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
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

                    {/* Orders Table */}
                    {ordersLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="flex flex-col items-center gap-2">
                                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Updating order list...</p>
                            </div>
                        </div>
                    ) : (
                        <OrdersTable orders={orders} />
                    )}

                    <div className="text-sm text-muted-foreground">
                        Found {orders.length} order{orders.length !== 1 ? "s" : ""}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
