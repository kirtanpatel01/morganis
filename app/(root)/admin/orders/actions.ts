'use server'

import { createClient } from "@/lib/supabase/server"
import { supabaseAdminAuth } from "@/lib/supabase/auth-admin"
import { revalidatePath } from "next/cache"

export async function getOrders() {
  const supabase = await createClient()

  // 1. Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "Unauthorized" }
  }

  // 2. Get Store ID for this Admin
  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("id")
    .eq("admin_id", user.id)
    .single()

  if (storeError || !store) {
      console.error("Store not found for user", user.id)
      return { error: "Store not found" }
  }

  // 3. Fetch Orders (Service role allows viewing all detailed info)
  const { data: orders, error: ordersError } = await supabaseAdminAuth
    .from("orders")
    .select(`
        *,
        order_items (*)
    `)
    .eq("store_id", store.id)
    .order("created_at", { ascending: false })

  if (ordersError) {
    console.error("Error fetching orders:", ordersError)
    return { error: "Failed to fetch orders" }
  }

  return { orders }
}

export async function updateOrderStatus(orderId: string, status: string, rejectionReason?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: "Unauthorized" }

    // 1. Verify Store Ownership (Security)
    const { data: store } = await supabase
      .from("stores")
      .select("id")
      .eq("admin_id", user.id)
      .single()

    if (!store) return { success: false, error: "Unauthorized: Not store admin" }

    const updateData: any = { 
        status,
        user_id: user.id // Pass the user_id as requested to satisfy RLS for future updates
    }
    if (rejectionReason) {
        updateData.rejection_reason = rejectionReason
    }

    // 2. Perform Update using Service Role to bypass guest user_id restriction
    const { data: updatedData, error } = await supabaseAdminAuth
        .from("orders")
        .update(updateData)
        .eq("id", orderId)
        .eq("store_id", store.id) // Ensure we only update orders for this store
        .select()

    if (error) {
        console.error("Error updating order status:", error)
        return { success: false, error: "Failed to update status" }
    }

    if (!updatedData || updatedData.length === 0) {
        return { success: false, error: "Order not found or permission denied" }
    }
    
    revalidatePath("/admin/orders")
    return { success: true }
}

export async function updatePaymentStatus(orderId: string, status: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: "Unauthorized" }

    // Verify Store Ownership
    const { data: store } = await supabase
      .from("stores")
      .select("id")
      .eq("admin_id", user.id)
      .single()

    if (!store) return { success: false, error: "Unauthorized" }

    const { data: updatedData, error } = await supabaseAdminAuth
        .from("orders")
        .update({ payment_status: status, user_id: user.id })
        .eq("id", orderId)
        .eq("store_id", store.id)
        .select()

    if (error) {
        console.error("Error updating payment status:", error)
        return { success: false, error: "Failed to update payment status" }
    }

    if (!updatedData || updatedData.length === 0) {
        return { success: false, error: "Order not found or permission denied" }
    }

    revalidatePath("/admin/orders")
    return { success: true }
}
