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

  // 2. Fetch all orders
  const { data: orders, error: ordersError } = await supabaseAdminAuth
    .from("orders")
    .select("*, order_items (*)")
    .order("created_at", { ascending: false })

  if (ordersError) {
    console.error("Error fetching all orders:", ordersError)
    return { error: "Failed to fetch orders" }
  }

  // 3. Fetch all stores for mapping
  const { data: stores, error: storesError } = await supabaseAdminAuth
    .from("stores")
    .select("id, name, admin_id")

  const storeMap = new Map<string, any>()
  if (stores) {
      stores.forEach(s => storeMap.set(s.id, s))
  }

  // 4. Fetch all admin users to get their names
  const { data: { users }, error: usersError } = await supabaseAdminAuth.auth.admin.listUsers()
  
  const ownerNameMap = new Map<string, string>()
  if (!usersError && users) {
      users.forEach(u => {
          ownerNameMap.set(u.id, u.user_metadata?.name || u.user_metadata?.full_name || "Unknown")
      })
  }

  // 5. Attach owner name and store info
  const ordersWithInfo = (orders || []).map((order: any) => {
      const store = storeMap.get(order.store_id)
      
      return {
          ...order,
          stores: store, // UI expects order.stores.name
          store_owner_name: store?.admin_id ? ownerNameMap.get(store.admin_id) : "Unknown"
      }
  })

  return { orders: ordersWithInfo }
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

