"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRecentOrders, useUpdateOrderStatus } from "../hooks/use-dashboard";

export function RecentOrders() {
    const { data: orders, isLoading } = useRecentOrders();
    const { mutate: updateStatus } = useUpdateOrderStatus();

    if (isLoading) return <div>Loading orders...</div>;

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders?.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span>{order.customerName}</span>
                                    <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        order.status === "completed" || order.status === "paid_and_completed"
                                            ? "default" // "success" if available, else default (usually black/primary)
                                            : order.status === "pending"
                                                ? "secondary"
                                                : "outline"
                                    }
                                    className={
                                        order.status === "completed" || order.status === "paid_and_completed" ? "bg-green-500 hover:bg-green-600" :
                                            order.status === "pending" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""
                                    }
                                >
                                    {order.status.replace(/_/g, " ")}
                                </Badge>
                            </TableCell>
                            <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() => navigator.clipboard.writeText(order.id)}
                                        >
                                            Copy Order ID
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => { }}>View Details</DropdownMenuItem>

                                        {order.status === 'pending' && (
                                            <DropdownMenuItem onClick={() => updateStatus({ orderId: order.id, status: 'accepted' })}>
                                                Accept Order
                                            </DropdownMenuItem>
                                        )}
                                        {order.status === 'accepted' && (
                                            <DropdownMenuItem onClick={() => updateStatus({ orderId: order.id, status: 'completed' })}>
                                                Mark as Ready
                                            </DropdownMenuItem>
                                        )}
                                        {order.status === 'completed' && (
                                            <DropdownMenuItem onClick={() => updateStatus({ orderId: order.id, status: 'paid_and_completed' })}>
                                                Mark Paid & Complete
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
