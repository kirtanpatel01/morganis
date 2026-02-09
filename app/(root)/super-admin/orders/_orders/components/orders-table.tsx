"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import type { Order } from "../types"

interface OrdersTableProps {
    orders: Order[]
}

const getStatusColor = (status: Order["status"]) => {
    switch (status) {
        case "completed":
            return "bg-green-600 hover:bg-green-700 text-white"
        case "pending":
            return "text-yellow-600 border-yellow-600"
        case "processing":
            return "bg-blue-600 hover:bg-blue-700 text-white"
        case "cancelled":
            return "bg-red-600 hover:bg-red-700 text-white"
        case "rejected":
            return "bg-red-600 hover:bg-red-700 text-white"
        default:
            return "bg-gray-100 text-gray-800"
    }
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })
}

const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`
}

export function OrdersTable({ orders }: OrdersTableProps) {
    if (orders.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">No orders found matching filters</p>
            </div>
        )
    }

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Store</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-mono text-sm">{order.orderId}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {formatDate(order.createdAt)}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">{order.customerName}</span>
                                    <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-sm font-medium">{order.storeName}</TableCell>
                            <TableCell>{order.items.length} items</TableCell>
                            <TableCell className="font-bold">{formatCurrency(order.totalAmount)}</TableCell>
                            <TableCell>
                                <Badge variant={order.status === "pending" ? "outline" : "default"} className={getStatusColor(order.status)}>
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View Details</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
