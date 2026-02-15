"use server"

import { createClient } from "@/lib/supabase/server"
import { supabaseAdminAuth } from "@/lib/supabase/auth-admin"
import { CartItem } from "@/components/pos/cart-store"

interface CreateOrderParams {
  customer: {
    name: string
    phone: string
    email?: string
  }
  items: CartItem[]
  total: number
  storeId: string
}

export async function createOrder(params: CreateOrderParams) {
  const supabase = await createClient()

  const { customer, items, total, storeId } = params

  if (!storeId) {
    return { success: false, error: "Store ID is missing" }
  }

  if (items.length === 0) {
    return { success: false, error: "Cart is empty" }
  }

  // Server-side Validation: Phone (10 digits)
  const phoneRegex = /^\d{10}$/
  if (!phoneRegex.test(customer.phone)) {
    return { success: false, error: "Invalid phone number (10 digits required)" }
  }

  // Server-side Validation: Email
  if (customer.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customer.email)) {
      return { success: false, error: "Invalid email format" }
    }
  }

  try {
    // 1. Create Order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        store_id: storeId,
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_email: customer.email || null,
        total_amount: total,
        status: "pending",
        payment_status: "pending",
      })
      .select("id")
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return { success: false, error: "Failed to create order" }
    }

    if (!order) {
        return { success: false, error: "Failed to create order (no data returned)" }
    }

    // 2. Create Order Items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // Cleanup: delete the order if items failed (optional but good for consistency)
      await supabase.from("orders").delete().eq("id", order.id)
      return { success: false, error: "Failed to create order items" }
    }

    return { success: true, orderId: order.id }
  } catch (_error) {
    console.error("Unexpected error in createOrder:", _error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getOrder(orderId: string) {
  const supabase = await createClient()

  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .eq("id", orderId)
      .single()

    if (error) {
      console.error("Error fetching order:", error)
      return null
    }

    return order
  } catch (_error) {
    console.error("Unexpected error in getOrder:", _error)
    return null
  }
}

export async function simulatePayment(orderId: string) {

    // 1. Set to processing using Admin Client (Bypass RLS because guests can't normally update)
    const { data, error: updateError } = await supabaseAdminAuth
        .from("orders")
        .update({ payment_status: "processing" })
        .eq("id", orderId)
        .select()

    if (updateError || !data || data.length === 0) {
        console.error("Payment simulation failed (update blocked or not found):", updateError)
        return { success: false, error: "Payment simulation failed" }
    }

    // 2. Simulate delay (2 seconds)
    // Note: In server action, delay might timeout if too long, but 2s is fine.
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 3. Set to paid (success)
    // In real scenario, we would verify payment here.
    // Modified: Leave as processing so cashier can confirm.
    // const { error } = await supabase.from("orders").update({ payment_status: "paid" }).eq("id", orderId)

    // if (error) {
    //     console.error("Error simulating payment:", error)
    //     return { success: false, error: "Payment simulation failed" }
    // }

    return { success: true }
}
