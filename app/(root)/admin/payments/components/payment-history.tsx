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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { usePayments } from "../hooks/use-payments";
import { PaymentMethod, PaymentStatus } from "../types";
import { format } from "date-fns";

export function PaymentHistory() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
    const [methodFilter, setMethodFilter] = useState<PaymentMethod | "all">("all");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);

    const { data: paymentsData, isLoading } = usePayments({
        search,
        status: statusFilter,
        method: methodFilter,
        page,
        limit: pageSize,
    });

    // Custom badge to handle success color if needed, or just standard badges
    const StatusBadge = ({ status }: { status: PaymentStatus }) => {
        let className = "";
        if (status === 'completed') className = "bg-green-500 hover:bg-green-600 border-transparent text-primary-foreground";
        return (
            <Badge variant={status === 'failed' ? 'destructive' : (status === 'pending' ? 'secondary' : 'outline')} className={className}>
                {status}
            </Badge>
        )
    }

    if (isLoading) return <div>Loading history...</div>;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-[250px]">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search payments..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-8"
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={(v) => {
                        setStatusFilter(v as PaymentStatus | "all");
                        setPage(1);
                    }}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={methodFilter} onValueChange={(v) => {
                        setMethodFilter(v as PaymentMethod | "all");
                        setPage(1);
                    }}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Method" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Methods</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="credit_card">Credit Card</SelectItem>
                            <SelectItem value="online_wallet">Online Wallet</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paymentsData?.data.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell className="font-mono text-xs">{payment.transactionId || "-"}</TableCell>
                                <TableCell className="font-medium">{payment.orderId}</TableCell>
                                <TableCell>{format(new Date(payment.createdAt), "MMM d, HH:mm")}</TableCell>
                                <TableCell>{payment.customerName}</TableCell>
                                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                                <TableCell className="capitalize">{payment.method.replace('_', ' ')}</TableCell>
                                <TableCell>
                                    <StatusBadge status={payment.status} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {paymentsData?.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No payments found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Showing {paymentsData?.data.length} of {paymentsData?.total} payments
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
                        Page {page} of {Math.ceil((paymentsData?.total || 0) / pageSize)}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => p + 1)}
                        disabled={!paymentsData || page >= Math.ceil(paymentsData.total / pageSize) || isLoading}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
