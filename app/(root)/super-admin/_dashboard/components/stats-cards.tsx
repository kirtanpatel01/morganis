"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, TrendingUp, IndianRupee, Users } from "lucide-react"
import type { DashboardStats } from "../types"

interface StatsCardsProps {
    stats: DashboardStats
}

const iconMap = {
    Building2: Building2,
    TrendingUp: TrendingUp,
    IndianRupee: IndianRupee,
    Users: Users,
}

const statsConfig = [
    {
        key: "totalStores" as const,
        title: "Total Stores",
        icon: "Building2",
        color: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
        key: "totalOrders" as const,
        title: "Total Orders",
        icon: "TrendingUp",
        color: "text-green-500",
        bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
        key: "totalRevenue" as const,
        title: "Total Revenue",
        icon: "IndianRupee",
        color: "text-purple-500",
        bgColor: "bg-purple-50 dark:bg-purple-950",
        prefix: "₹",
        formatAsCurrency: true,
    },
    {
        key: "activeStores" as const,
        title: "Active Stores",
        icon: "Users",
        color: "text-pink-500",
        bgColor: "bg-pink-50 dark:bg-pink-950",
    },
]

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsConfig.map((config) => {
                const Icon = iconMap[config.icon as keyof typeof iconMap]
                const value = stats[config.key]
                const displayValue = config.formatAsCurrency
                    ? `${config.prefix}${value.toFixed(2)}`
                    : value

                return (
                    <Card key={config.key} className="relative overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {config.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${config.bgColor}`}>
                                <Icon className={`h-5 w-5 ${config.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{displayValue}</div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
