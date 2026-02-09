"use client"

import { useEffect, useState } from "react"
import { StatsCards, StoreManagementTable, CreateStoreModal } from "./_dashboard/components"
import { getDashboardStats, getStores } from "./_dashboard/actions"
import type { DashboardStats, Store } from "./_dashboard/types"
import { toast } from "sonner"

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const fetchData = async () => {
    try {
      const [statsData, storesData] = await Promise.all([
        getDashboardStats(),
        getStores(),
      ])
      setStats(statsData)
      setStores(storesData)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateStore = () => {
    setIsCreateModalOpen(true)
  }

  const handleStoreCreated = () => {
    // Refresh the stores list after creating a new store
    fetchData()
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} />}

      {/* Store Management Table */}
      <StoreManagementTable stores={stores} onCreateStore={handleCreateStore} />

      {/* Create Store Modal */}
      <CreateStoreModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onStoreCreated={handleStoreCreated}
      />
    </div>
  )
}