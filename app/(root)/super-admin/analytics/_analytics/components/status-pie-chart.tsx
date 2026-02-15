"use client"

import { useEffect, useState } from "react"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBreakdown } from "../types"

interface StatusPieChartProps {
    data: StatusBreakdown[]
}

const CustomTooltip = ({ active, payload }: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-zinc-900 border rounded-lg p-3 shadow-xl ring-1 ring-black/5">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">{payload[0].name}</p>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Total</span>
                    <span className="text-sm font-bold" style={{ color: (payload[0].payload as { color?: string })?.color }}>{payload[0].value || 0}</span>
                </div>
            </div>
        )
    }
    return null
}

export function StatusPieChart({ data }: StatusPieChartProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0)
        return () => clearTimeout(timer)
    }, [])

    if (!mounted) return (
        <Card className="col-span-full lg:col-span-2">
            <CardHeader><CardTitle className="text-base font-semibold">Order Status Breakdown</CardTitle></CardHeader>
            <CardContent><div className="h-[300px] w-full bg-muted/10 animate-pulse rounded-lg" /></CardContent>
        </Card>
    )

    return (
        <Card className="col-span-full lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Order Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="count"
                                nameKey="status"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                formatter={(value) => <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
