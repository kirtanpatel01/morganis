"use client"

import { useEffect, useState } from "react"
import { StatsCards } from "./_dashboard/components"
import { getDashboardStats } from "./_dashboard/actions"
import { DashboardStats } from "./_dashboard/types"
import { toast } from "sonner"

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [statsData] = await Promise.all([
        getDashboardStats(),
      ])
      setStats(statsData)
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
    </div>
  )
}