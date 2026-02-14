"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import type { Database } from "../../../../../types/supabase"

type Order = Database["public"]["Tables"]["orders"]["Row"] & {
    order_items: Database["public"]["Tables"]["order_items"]["Row"][]
}

interface OrderDetailsDialogProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus?: (status: string) => void
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order #{order.id.slice(0, 8)}
            <Badge variant="outline">{order.status}</Badge>
          </DialogTitle>
          <DialogDescription>
            Placed on {format(new Date(order.created_at), "PPP p")}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-medium text-muted-foreground mb-1">Customer</h4>
                        <p>{order.customer_name}</p>
                        <p className="text-muted-foreground">{order.customer_phone}</p>
                        {order.customer_email && <p className="text-muted-foreground">{order.customer_email}</p>}
                    </div>
                    <div>
                         <h4 className="font-medium text-muted-foreground mb-1">Payment</h4>
                         <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                            {order.payment_status}
                         </Badge>
                    </div>
                </div>

                <Separator />

                {/* Order Items */}
                <div className="space-y-3">
                    <h4 className="font-medium text-sm">Items ({order.order_items.length})</h4>
                    <div className="space-y-2">
                        {order.order_items.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <div className="flex gap-2">
                                    <span className="font-medium w-8 text-center bg-muted rounded-sm">{item.quantity}x</span>
                                    <span>{item.product_name}</span>
                                </div>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${order.total_amount.toFixed(2)}</span>
                    </div>
                </div>
                
                {order.rejection_reason && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                        <span className="font-medium">Rejection Reason:</span> {order.rejection_reason}
                    </div>
                )}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
