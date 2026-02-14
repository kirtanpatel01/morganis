"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { simulatePayment } from "@/app/(root)/order/actions"

// Define Order type locally or import if available
interface Order {
  id: string
  status: string
  payment_status: string
  customer_name: string
  rejection_reason?: string
  total_amount: number
  [key: string]: any
}

interface OrderStatusProps {
  initialOrder: Order
}

export function OrderStatus({ initialOrder }: OrderStatusProps) {
  const [order, setOrder] = useState<Order>(initialOrder)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  
  // Initialize Supabase ONLY ONCE
  const supabase = React.useMemo(() => createClient(), [])
  const router = useRouter()

  useEffect(() => {
    let isApplied = true
    let channel: ReturnType<typeof supabase.channel> | null = null

    const setupSubscription = async () => {
      // Small delay to let Strict Mode mount/unmount cycle settle
      // This prevents the "WebSocket is closed before established" error
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (!isApplied) return
      
      console.log(`[Realtime] Setting up subscription for order: ${order.id}`)
      
      channel = supabase
        .channel(`order_updates_${order.id}`) // Precise channel name
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `id=eq.${order.id}`,
          },
          (payload: { [key: string]: any }) => {
            console.log("[Realtime] Payload received:", payload)
            
            setOrder((prev) => {
                const newState = { ...prev, ...payload.new } as Order
                if (payload.new.status && payload.new.status !== prev.status) {
                    console.log(`[Realtime] Status change: ${prev.status} -> ${payload.new.status}`)
                    toast.info(`Order status updated to: ${payload.new.status}`)
                }

                if (payload.new.payment_status && payload.new.payment_status !== prev.payment_status) {
                    console.log(`[Realtime] Payment update: ${prev.payment_status} -> ${payload.new.payment_status}`)
                    toast.success(`Payment status: ${payload.new.payment_status}`)
                }
                return newState
            })
          }
        )
        .subscribe((status: string, err?: Error) => {
            console.log(`[Realtime] Subscription status for ${order.id}:`, status)
            if (err) console.error("[Realtime] Subscription error:", err)
        })
    }

    setupSubscription()

    return () => {
      isApplied = false
      if (channel) {
        console.log(`[Realtime] Cleaning up subscription for order: ${order.id}`)
        supabase.removeChannel(channel)
      }
    }
  }, [order.id, supabase])

  const handlePayOnline = async () => {
      setIsProcessingPayment(true)
      try {
          const result = await simulatePayment(order.id) as { success: boolean, error?: string }
          if (!result.success) {
              toast.error(result.error || "Payment simulation failed")
          } else {
              toast.success("Payment successful! Waiting for store confirmation.")
          }
      } catch (error) {
          toast.error("An error occurred during payment")
      } finally {
          setIsProcessingPayment(false)
      }
  }

  // Render logic
  const renderContent = () => {
      switch (order.status) {
          case "pending":
              return (
                  <div className="flex flex-col items-center gap-4 py-8">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <div className="text-center">
                          <h3 className="text-xl font-semibold">Waiting for store acceptance</h3>
                          <p className="text-muted-foreground">Please wait while the store reviews your order.</p>
                      </div>
                  </div>
              )
          case "accepted":
              if (order.payment_status === 'paid' || order.payment_status === 'processing') {
                  return (
                      <div className="flex flex-col items-center gap-4 py-8">
                          <Loader2 className="h-12 w-12 animate-spin text-primary" />
                          <div className="text-center">
                              <h3 className="text-xl font-semibold">Payment Processing</h3>
                              <p className="text-muted-foreground">Store is confirming your payment.</p>
                          </div>
                      </div>
                  )
              }
              return (
                  <div className="flex flex-col gap-4">
                      <div className="text-center mb-4">
                          <h3 className="text-xl font-semibold text-green-600">Order Accepted!</h3>
                          <p className="text-muted-foreground">Please select a payment method.</p>
                      </div>
                      <div className="grid gap-3">
                          <Button 
                            className="w-full" 
                            size="lg" 
                            onClick={handlePayOnline} 
                            disabled={isProcessingPayment}
                          >
                              {isProcessingPayment ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                              Pay Online
                          </Button>
                          <Button variant="outline" className="w-full" size="lg">
                              Pay with Cash
                          </Button>
                      </div>
                  </div>
              )
          case "rejected":
              return (
                  <div className="text-center py-8">
                      <h3 className="text-xl font-semibold text-destructive">Order Rejected</h3>
                      <p className="text-muted-foreground mt-2">
                          Reason: {order.rejection_reason || "Store is currently busy."}
                      </p>
                      <Button variant="outline" className="mt-4" onClick={() => router.push("/")}>
                          Back to Store
                      </Button>
                  </div>
              )
          case "completed":
          case "ready":
              return (
                  <div className="text-center py-8">
                      <h3 className="text-xl font-semibold text-green-600">Order Confirmed!</h3>
                      <p className="text-muted-foreground">Thank you for your purchase.</p>
                      <Button className="mt-4" onClick={() => router.push("/")}>
                          Shop Again
                      </Button>
                  </div>
              )
            case "cancelled":
                return (
                    <div className="text-center py-8">
                        <h3 className="text-xl font-semibold text-destructive">Order Cancelled</h3>
                    </div>
                )
          default:
              return (
                  <div className="text-center py-8">
                      <h3 className="text-xl font-semibold">Order Status: {order.status}</h3>
                  </div>
              )
      }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
            <span>Order #{order.id.slice(0, 8)}</span>
            <Badge variant={order.status === 'pending' ? 'outline' : 'default'}>
                {order.status}
            </Badge>
        </CardTitle>
        <CardDescription>
            Total Amount: ${order.total_amount ? Number(order.total_amount).toFixed(2) : "0.00"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  )
}
