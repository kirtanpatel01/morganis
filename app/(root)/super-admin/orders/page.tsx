import { getAllOrders, getSuperAdminOrderStats, getStoresList } from "./actions"
import { SuperAdminOrdersClient } from "./components/super-admin-orders-client"
import { Separator } from "@/components/ui/separator"

export default async function SuperAdminOrdersPage() {
    // 1. Fetch ALL data on the server for instant hydration
    const [ordersResult, statsResult, storesResult] = await Promise.all([
        getAllOrders(),
        getSuperAdminOrderStats(),
        getStoresList()
    ])

    const orders = ordersResult?.orders || []
    const stats = statsResult?.stats || { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, completedOrders: 0 }
    const stores = storesResult?.stores || []

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Global Orders</h2>
                    <p className="text-muted-foreground">
                        Real-time overview of all orders across every store in the platform.
                    </p>
                </div>
            </div>
            <Separator />
            <SuperAdminOrdersClient 
                initialOrders={orders}
                initialStats={stats}
                initialStores={stores}
            />
        </div>
    )
}
