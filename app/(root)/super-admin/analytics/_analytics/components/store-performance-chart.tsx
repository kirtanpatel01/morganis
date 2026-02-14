"use client"

import { useEffect, useState } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, TooltipProps } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StorePerformance } from "../types"

interface StorePerformanceChartProps {
    data: StorePerformance[]
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as StorePerformance
        return (
            <div className="bg-white dark:bg-zinc-900 border rounded-lg p-3 shadow-xl ring-1 ring-black/5">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">{data.storeName}</p>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Revenue</span>
                        <span className="text-sm font-bold text-primary">₹{data.revenue?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Orders</span>
                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{data.orders || 0}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Growth</span>
                        <span className="text-sm font-bold text-green-600">+{data.growth || 0}%</span>
                    </div>
                </div>
            </div>
        )
    }
    return null
}

export function StorePerformanceChart({ data }: StorePerformanceChartProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0)
        return () => clearTimeout(timer)
    }, [])

    if (!mounted) return (
        <Card className="col-span-full lg:col-span-3">
            <CardHeader><CardTitle className="text-base font-semibold">Store Revenue Comparison</CardTitle></CardHeader>
            <CardContent><div className="h-[300px] w-full bg-muted/10 animate-pulse rounded-lg" /></CardContent>
        </Card>
    )

    // Sort by revenue
    const sortedData = [...data].sort((a, b) => b.revenue - a.revenue)

    return (
        <Card className="col-span-full lg:col-span-3">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Store Revenue Comparison</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sortedData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#888' }}
                                tickFormatter={(val) => `₹${val / 1000}k`}
                            />
                            <YAxis
                                dataKey="storeName"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#888' }}
                                width={120}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                            <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={30}>
                                {sortedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill="var(--primary)"
                                        fillOpacity={1 - index * 0.15}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
