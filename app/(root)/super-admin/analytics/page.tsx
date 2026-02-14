"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download, Calendar, TrendingUp } from "lucide-react"
import { toast } from "sonner"

import {
    AnalyticsStatsCards,
    RevenueTrendChart,
    StorePerformanceChart,
    StatusPieChart
} from "./_analytics/components"
import {
    getAnalyticsSummary,
    getRevenueTrends,
    getStorePerformance,
    getStatusBreakdown
} from "./_analytics/actions"
import type {
    AnalyticsSummary,
    RevenueDataPoint,
    StorePerformance,
    StatusBreakdown,
    TimeRange
} from "./_analytics/types"

export default function AnalyticsPage() {
    // Data states
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
    const [revenueTrends, setRevenueTrends] = useState<RevenueDataPoint[]>([])
    const [performance, setPerformance] = useState<StorePerformance[]>([])
    const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdown[]>([])

    // UI states
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [timeRange, setTimeRange] = useState<TimeRange>("7d")

    const fetchAnalyticsData = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true)
        else setLoading(true)

        try {
            const [summaryData, trendsData, perfData, breakdownData] = await Promise.all([
                getAnalyticsSummary(timeRange),
                getRevenueTrends(timeRange),
                getStorePerformance(timeRange),
                getStatusBreakdown(),
            ])

            setSummary(summaryData)
            setRevenueTrends(trendsData)
            setPerformance(perfData)
            setStatusBreakdown(breakdownData)
        } catch (error) {
            console.error("Failed to fetch analytics data:", error)
            toast.error("Failed to load analytics dashboard")
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [timeRange])

    useEffect(() => {
        fetchAnalyticsData()
    }, [fetchAnalyticsData])

    const handleTimeRangeChange = (value: string) => {
        setTimeRange(value as TimeRange)
    }

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <RefreshCw className="h-10 w-10 animate-spin text-primary/30" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">
                        Assembling platform insights...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-8 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-muted/30 p-6 rounded-2xl border">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 italic">
                        Platform <span className="text-primary not-italic">Analytics</span>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Aggregate data and growth metrics across all operational stores.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Tabs value={timeRange} onValueChange={handleTimeRangeChange} className="bg-background/50 p-1 rounded-lg border">
                        <TabsList className="h-9 bg-transparent">
                            <TabsTrigger value="24h" className="text-xs px-3">24h</TabsTrigger>
                            <TabsTrigger value="7d" className="text-xs px-3">7d</TabsTrigger>
                            <TabsTrigger value="30d" className="text-xs px-3">30d</TabsTrigger>
                            <TabsTrigger value="1y" className="text-xs px-3">1y</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="h-9 w-px bg-border mx-1" />

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-2"
                        onClick={() => fetchAnalyticsData(true)}
                        disabled={refreshing}
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>

                    <Button
                        variant="default"
                        size="sm"
                        className="h-9 gap-2 shadow-sm"
                    >
                        <Download className="h-3.5 w-3.5" />
                        Report
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            {summary && <AnalyticsStatsCards summary={summary} />}

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
                {/* Revenue Trend Chart */}
                <RevenueTrendChart data={revenueTrends} />

                {/* Status Pie Chart */}
                <StatusPieChart data={statusBreakdown} />
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
                {/* Store Performance Chart */}
                <StorePerformanceChart data={performance} />

                <Card className="lg:col-span-2 overflow-hidden border-dashed">
                    <CardHeader className="bg-muted/30">
                        <CardTitle className="text-base font-semibold">Growth Strategy</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">Top Performing Category</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Main Course dishes have grown by 22% this week. Consider promoting combo offers.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">Peak Selling Hours</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Platform traffic peaks at 8:00 PM. Optimize server capacity for this window.
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mt-4">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Automated Insight</p>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                    Store <span className="font-bold">&quot;Venkatesh&quot;</span> is currently outperforming others in Average Order Value. Study their multi-item order patterns for platform-wide implementation.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
