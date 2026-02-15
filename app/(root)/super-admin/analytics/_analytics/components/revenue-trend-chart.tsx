"use client"

import { useEffect, useState } from "react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RevenueDataPoint } from "../types"

interface RevenueTrendChartProps {
    data: RevenueDataPoint[]
}

const CustomTooltip = ({ active, payload, label }: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-zinc-900 border rounded-lg p-3 shadow-xl ring-1 ring-black/5">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">{new Date(label as string).toLocaleDateString("en-IN", { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Revenue</span>
                        <span className="text-sm font-bold text-primary">₹{payload[0].value?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Orders</span>
                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{payload[1]?.value || 0}</span>
                    </div>
                </div>
            </div>
        )
    }
    return null
}

export function RevenueTrendChart({ data }: RevenueTrendChartProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0)
        return () => clearTimeout(timer)
    }, [])

    if (!mounted) return (
        <Card className="col-span-full lg:col-span-3">
            <CardHeader><CardTitle className="text-base font-semibold">Revenue & Order Trends</CardTitle></CardHeader>
            <CardContent><div className="h-[350px] w-full bg-muted/10 animate-pulse rounded-lg" /></CardContent>
        </Card>
    )

    return (
        <Card className="col-span-full lg:col-span-3">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Revenue & Order Trends</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#888' }}
                                tickFormatter={(str) => new Date(str).toLocaleDateString("en-IN", { month: 'short', day: 'numeric' })}
                                minTickGap={30}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#888' }}
                                tickFormatter={(val) => `₹${val / 1000}k`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                name="Revenue"
                                stroke="var(--primary)"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                            <Area
                                type="monotone"
                                dataKey="orders"
                                name="Orders"
                                stroke="#64748b"
                                strokeWidth={2}
                                fill="transparent"
                                strokeDasharray="5 5"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
