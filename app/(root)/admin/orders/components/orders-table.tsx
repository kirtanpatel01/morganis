"use client";

import { useState } from "react";
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
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, Filter } from "lucide-react";
import { useOrders, useUpdateOrder } from "../hooks/use-orders";
import { Order, OrderStatus, PaymentMethod } from "../types";
import { format } from "date-fns";
import { toast } from "sonner";
import { OrderDetails } from "./order-details";

export function OrdersTable() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
    const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | "all">("all");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);

    const { data: ordersData, isLoading } = useOrders({
        search,
        status: statusFilter,
        paymentMethod: paymentFilter,
        page,
        limit: pageSize,
    });
    const { mutate: updateOrder } = useUpdateOrder();

    // Reset pagination when filters change
    const onSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const onStatusFilterChange = (value: OrderStatus | "all") => {
        setStatusFilter(value);
        setPage(1);
    };

    const onPaymentFilterChange = (value: PaymentMethod | "all") => {
        setPaymentFilter(value);
        setPage(1);
    };

    const handleStatusUpdate = (id: string, newStatus: OrderStatus) => {
        updateOrder({ id, status: newStatus }, {
            onSuccess: () => toast.success(`Order ${id} updated to ${newStatus}`),
            onError: () => toast.error("Failed to update order")
        });
    }

    // Quick Fix for "success" variant not existing by default in Shadcn Badge
    const StatusBadge = ({ status }: { status: OrderStatus }) => {
        let className = "";
        if (status === 'completed' || status === 'paid_and_completed') className = "bg-green-500 hover:bg-green-600 border-transparent text-primary-foreground";
        if (status === 'pending') className = "bg-yellow-500 hover:bg-yellow-600 border-transparent text-primary-foreground";

        return (
            <Badge variant={status === 'cancelled' ? 'destructive' : (status === 'accepted' ? 'default' : 'outline')} className={className}>
                {status.replace(/_/g, ' ')}
            </Badge>
        )
    }

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
    }

    // Convert orders to CSV and download
    const exportToCSV = () => {
        if (!ordersData?.data) return;

        const headers = ["ID", "Customer", "Email", "Phone", "Date", "Total", "Status", "Payment"];
        const rows = ordersData.data.map(o => [
            o.id,
            o.customerName,
            o.customerEmail,
            o.phoneNumber,
            format(new Date(o.createdAt), "yyyy-MM-dd HH:mm"),
            o.totalAmount.toFixed(2),
            o.status,
            o.paymentMethod
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `orders_export_${format(new Date(), "yyyyMMdd")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if (isLoading) return <div>Loading orders...</div>;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-[250px]">
                        {/* ... Search input existing code ... */}
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search orders..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as OrderStatus | "all")}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="paid_and_completed">Paid & Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={paymentFilter} onValueChange={(v) => onPaymentFilterChange(v as PaymentMethod | "all")}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Payment" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Method</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={exportToCSV} disabled={!ordersData?.data.length}>
                        Export
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ordersData?.data.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{order.customerName}</span>
                                        <span className="text-xs text-muted-foreground">{order.phoneNumber}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{format(new Date(order.createdAt), "MMM d, HH:mm")}</TableCell>
                                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                <TableCell className="capitalize">{order.paymentMethod}</TableCell>
                                <TableCell>
                                    <StatusBadge status={order.status} />
                                </TableCell>
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
                                            <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>
                                                Copy ID
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'accepted')}>
                                                Mark Accepted
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'completed')}>
                                                Mark Completed
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'paid_and_completed')}>
                                                Mark Paid & Complete
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                            >
                                                Cancel Order
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {ordersData?.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Showing {ordersData?.data.length} of {ordersData?.total} orders
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || isLoading}
                    >
                        Previous
                    </Button>
                    <span className="text-sm font-medium">
                        Page {page} of {Math.ceil((ordersData?.total || 0) / pageSize)}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => p + 1)}
                        disabled={!ordersData || page >= Math.ceil(ordersData.total / pageSize) || isLoading}
                    >
                        Next
                    </Button>
                </div>
            </div>
            <OrderDetails
                order={selectedOrder}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
            />
        </div>
    );
}
