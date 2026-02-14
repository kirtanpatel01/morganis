"use client"

import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Ban, CheckCircle, CreditCard, Eye, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { updatePaymentStatus } from "../actions"
import { useUpdateOrder } from "../hooks/use-orders"
import { format } from "date-fns"
import { OrderDetailsDialog } from "./order-details-dialog"
import { toast } from "sonner"
import type { Database } from "../../../../../types/supabase"

type Order = Database["public"]["Tables"]["orders"]["Row"] & {
    order_items: Database["public"]["Tables"]["order_items"]["Row"][]
}

interface OrderRowProps {
  order: Order
  showActions?: boolean
  variant?: 'table' | 'card'
}

export function OrderRow({ order, showActions = true, variant = 'table' }: OrderRowProps) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isUpdatingPayment, setIsUpdatingPayment] = useState(false)
    const updateOrderMutation = useUpdateOrder()

    const handleStatusUpdate = async (status: string, rejectionReason?: string) => {
        updateOrderMutation.mutate({ id: order.id, status, rejectionReason }, {
            onSuccess: () => {
                toast.success(`Order marked as ${status}`)
            },
            onError: (error: any) => {
                toast.error(error.message || "Failed to update status")
            }
        })
    }

    const handlePaymentUpdate = async (status: string) => {
        setIsUpdatingPayment(true)
        try {
            const result = await updatePaymentStatus(order.id, status)
            if (result.success) {
                toast.success(`Payment status updated to ${status}`)
                if (status === 'paid') {
                    handleStatusUpdate('completed')
                }
            } else {
                toast.error(result.error || "Failed to update payment")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsUpdatingPayment(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500 hover:bg-yellow-600 text-white border-transparent'
            case 'accepted': return 'bg-blue-500 hover:bg-blue-600 text-white border-transparent'
            case 'processing': return 'bg-purple-500 hover:bg-purple-600 text-white border-transparent'
            case 'completed': 
            case 'ready': return 'bg-green-500 hover:bg-green-600 text-white border-transparent'
            case 'cancelled':
            case 'rejected': return 'bg-red-500 hover:bg-red-600 text-white border-transparent'
            default: return 'outline'
        }
    }

    if (variant === 'card') {
        return (
            <div className="p-4 border rounded-lg bg-card space-y-4 shadow-sm">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold">#{order.id.slice(0, 8)}</span>
                            <Badge className={getStatusColor(order.status)} variant="outline">
                                {order.status}
                            </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {format(new Date(order.created_at), "MMM d, h:mm a")}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold">${order.total_amount.toFixed(2)}</div>
                        <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'} className="text-[10px] px-1.5 h-4">
                            {order.payment_status}
                        </Badge>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">{order.customer_name}</span>
                        <span className="text-xs text-muted-foreground">{order.customer_phone}</span>
                    </div>
                    <div className="text-xs border-t pt-2 mt-2">
                        <span className="font-medium">{order.order_items.length} items: </span>
                        <span className="text-muted-foreground">
                            {order.order_items.map(i => i.product_name).join(", ")}
                        </span>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 gap-2"
                        onClick={() => setIsDetailsOpen(true)}
                    >
                        <Eye className="h-4 w-4" />
                        Details
                    </Button>

                    {showActions && (
                        <>
                            {order.status === 'pending' && (
                                <>
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="h-8 text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
                                        onClick={() => handleStatusUpdate('rejected', 'Store Rejected')}
                                        disabled={updateOrderMutation.isPending}
                                    >
                                        Reject
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        className="h-8 bg-green-600 hover:bg-green-700"
                                        onClick={() => handleStatusUpdate('accepted')}
                                        disabled={updateOrderMutation.isPending}
                                    >
                                        Accept
                                    </Button>
                                </>
                            )}

                            {order.status === 'accepted' && order.payment_status === 'processing' && (
                                 <Button 
                                    size="sm" 
                                    className="h-8 bg-green-600 hover:bg-green-700 w-full"
                                    onClick={() => handlePaymentUpdate('paid')}
                                    disabled={isUpdatingPayment || updateOrderMutation.isPending}
                                >
                                    Confirm Payment
                                </Button>
                            )}
                        </>
                    )}
                </div>

                <OrderDetailsDialog 
                    order={order} 
                    open={isDetailsOpen} 
                    onOpenChange={setIsDetailsOpen}
                    onUpdateStatus={handleStatusUpdate}
                />
            </div>
        )
    }

    return (
        <>
        <TableRow>
            <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span className="font-medium">{order.customer_name}</span>
                    <span className="text-xs text-muted-foreground">{order.customer_phone}</span>
                </div>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
                {format(new Date(order.created_at), "h:mm a")}
            </TableCell>
            <TableCell>
                <span className="text-sm">
                    {order.order_items.length} items
                </span>
                <span className="text-xs text-muted-foreground block truncate max-w-[150px]">
                    {order.order_items.map(i => i.product_name).join(", ")}
                </span>
            </TableCell>
            <TableCell>${order.total_amount.toFixed(2)}</TableCell>
            <TableCell>
                <Badge className={getStatusColor(order.status)} variant="outline">
                    {order.status}
                </Badge>
            </TableCell>
            <TableCell>
                <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                    {order.payment_status}
                </Badge>
            </TableCell>
            
            {showActions && (
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        {order.status === 'pending' && (
                            <>
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={() => handleStatusUpdate('accepted')}
                                    disabled={updateOrderMutation.isPending}
                                    title="Accept Order"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleStatusUpdate('rejected', 'Store Rejected')}
                                    disabled={updateOrderMutation.isPending}
                                    title="Reject Order"
                                >
                                    <XCircle className="h-4 w-4" />
                                </Button>
                            </>
                        )}

                        {order.status === 'accepted' && order.payment_status === 'processing' && (
                             <Button 
                                size="sm" 
                                className="h-8 bg-green-600 hover:bg-green-700"
                                onClick={() => handlePaymentUpdate('paid')}
                                disabled={isUpdatingPayment || updateOrderMutation.isPending}
                            >
                                Confirm Payment
                            </Button>
                        )}

                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setIsDetailsOpen(true)}
                        >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                </TableCell>
            )}
        </TableRow>
        
        <OrderDetailsDialog 
            order={order} 
            open={isDetailsOpen} 
            onOpenChange={setIsDetailsOpen}
            onUpdateStatus={handleStatusUpdate}
        />
        </>
    )
}
