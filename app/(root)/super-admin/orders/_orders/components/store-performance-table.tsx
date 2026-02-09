"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StoreOrderStats } from "../types"

interface StorePerformanceTableProps {
    stats: StoreOrderStats[]
}

const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`
}

export function StorePerformanceTable({ stats }: StorePerformanceTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Store Performance Reports</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Store Name</TableHead>
                                <TableHead className="text-right">Total Orders</TableHead>
                                <TableHead className="text-right">Total Revenue</TableHead>
                                <TableHead className="text-right">Avg. Order Value</TableHead>
                                <TableHead className="text-right">Monthly (Current)</TableHead>
                                <TableHead className="text-right">Yearly ({new Date().getFullYear()})</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.map((stat) => {
                                const currentMonth = stat.monthlyOrders[stat.monthlyOrders.length - 1]
                                const currentYear = stat.yearlyOrders[stat.yearlyOrders.length - 1]

                                return (
                                    <TableRow key={stat.storeId}>
                                        <TableCell className="font-medium">{stat.storeName}</TableCell>
                                        <TableCell className="text-right">{stat.totalOrders}</TableCell>
                                        <TableCell className="text-right font-bold text-green-600">
                                            {formatCurrency(stat.totalRevenue)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(stat.avgOrderValue)}
                                        </TableCell>
                                        <TableCell className="text-right text-sm">
                                            <div className="flex flex-col items-end">
                                                <span className="font-medium">{formatCurrency(currentMonth?.revenue || 0)}</span>
                                                <span className="text-xs text-muted-foreground">{currentMonth?.orders || 0} orders</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-sm">
                                            <div className="flex flex-col items-end">
                                                <span className="font-medium">{formatCurrency(currentYear?.revenue || 0)}</span>
                                                <span className="text-xs text-muted-foreground">{currentYear?.orders || 0} orders</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
