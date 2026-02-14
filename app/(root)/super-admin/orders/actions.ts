'use server'

import { createClient } from "@/lib/supabase/server"
import { supabaseAdminAuth } from "@/lib/supabase/auth-admin"

export async function getAllOrders() {
  const supabase = await createClient()

  // 1. Verify Super Admin (Security)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'super-admin') {
    return { error: "Unauthorized" }
  }

  // 2. Fetch all orders with store info
  const { data: orders, error } = await supabaseAdminAuth
    .from("orders")
    .select(`
        *,
        stores (
            id,
            name,
            admin_id
        ),
        order_items (*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all orders:", error)
    return { error: "Failed to fetch orders" }
  }

  // 3. Fetch all admin users to get their names
  const { data: { users }, error: usersError } = await supabaseAdminAuth.auth.admin.listUsers()
  
  const ownerNameMap = new Map<string, string>()
  if (!usersError && users) {
      users.forEach(u => {
          ownerNameMap.set(u.id, u.user_metadata?.full_name || u.user_metadata?.name || "Unknown")
      })
  }

  // 4. Attach owner name to orders
  const ordersWithOwner = orders.map((order: any) => ({
      ...order,
      store_owner_name: ownerNameMap.get(order.stores?.admin_id) || "Unknown"
  }))

  return { orders: ordersWithOwner }
}

export async function getSuperAdminOrderStats() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Security check
    if (!user || user.user_metadata?.role !== 'super-admin') {
      return { error: "Unauthorized" }
    }

    // Fetch basic stats
    const { data: orders, error } = await supabaseAdminAuth
        .from("orders")
        .select("status, total_amount")

    if (error || !orders) return { error: "Failed to fetch stats" }

    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const completedOrders = orders.filter(o => o.status === 'completed').length

    return {
        stats: {
            totalOrders,
            totalRevenue,
            pendingOrders,
            completedOrders
        }
    }
}

export async function getStoresList() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Security check
    if (!user || user.user_metadata?.role !== 'super-admin') {
      return { error: "Unauthorized" }
    }

    const { data: stores, error } = await supabase
        .from("stores")
        .select("id, name")
        .order("name")

    if (error) return { error: "Failed to fetch stores" }
    return { stores }
}

