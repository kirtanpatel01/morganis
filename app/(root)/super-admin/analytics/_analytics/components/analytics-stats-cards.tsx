"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, UserPlus, Building2 } from "lucide-react"
import { AnalyticsSummary } from "../types"

interface AnalyticsStatsCardsProps {
    summary: AnalyticsSummary
}

const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`
}

const formatPercent = (percent: number) => {
    const isPositive = percent >= 0
    return (
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(percent)}%
        </div>
    )
}

export function AnalyticsStatsCards({ summary }: AnalyticsStatsCardsProps) {
    const stats = [
        {
            title: "Total Platform Revenue",
            value: formatCurrency(summary.totalRevenue),
            growth: summary.revenueGrowth,
            icon: DollarSign,
            description: "Lifetime platform earnings"
        },
        {
            title: "Total Orders",
            value: summary.totalOrders.toLocaleString(),
            growth: summary.ordersGrowth,
            icon: ShoppingCart,
            description: "Total completed transactions"
        },
        {
            title: "Avg. Order Value",
            value: formatCurrency(summary.avgOrderValue),
            growth: summary.aovGrowth,
            icon: UserPlus,
            description: "Average spent per order"
        },
        {
            title: "Active Stores",
            value: summary.activeStores.toString(),
            growth: summary.storesGrowth,
            icon: Building2,
            description: "Stores currently operating"
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <div className="p-2 rounded-full bg-primary/10">
                            <stat.icon className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="flex items-center gap-2 mt-1">
                            {formatPercent(stat.growth)}
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                                vs last period
                            </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-3 italic">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
