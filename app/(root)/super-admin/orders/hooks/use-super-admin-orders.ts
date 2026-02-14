"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { getAllOrders, getSuperAdminOrderStats, getStoresList } from "../actions"
import type { Database } from "@/types/supabase"

type Order = Database["public"]["Tables"]["orders"]["Row"] & {
    stores: { id: string; name: string } | null
    order_items: Database["public"]["Tables"]["order_items"]["Row"][]
}

interface UseSuperAdminOrdersOptions {
    initialOrders?: Order[];
    initialStats?: any;
    initialStores?: { id: string; name: string }[];
}

export const useSuperAdminOrders = ({
    initialOrders,
    initialStats,
    initialStores
}: UseSuperAdminOrdersOptions = {}) => {
    const queryClient = useQueryClient()
    const supabase = useMemo(() => createClient(), [])

    // Queries
    const { data: orders, isLoading: isLoadingOrders } = useQuery({
        queryKey: ['super-admin', 'orders'],
        queryFn: async () => {
            const result = await getAllOrders()
            if (result.error) throw new Error(result.error)
            return result.orders as Order[]
        },
        initialData: initialOrders,
        staleTime: 1000 * 60, // 1 minute
    })

    const { data: stats, isLoading: isLoadingStats } = useQuery({
        queryKey: ['super-admin', 'order-stats'],
        queryFn: async () => {
            const result = await getSuperAdminOrderStats()
            if (result.error) throw new Error(result.error)
            return result.stats
        },
        initialData: initialStats,
        staleTime: 1000 * 60,
    })

    const { data: stores, isLoading: isLoadingStores } = useQuery({
        queryKey: ['super-admin', 'stores-list'],
        queryFn: async () => {
            const result = await getStoresList()
            if (result.error) throw new Error(result.error)
            return result.stores
        },
        initialData: initialStores,
        staleTime: 1000 * 60 * 60, // 1 hour
    })

    // Realtime Subscriptions
    useEffect(() => {
        let isApplied = true
        let channel: ReturnType<typeof supabase.channel> | null = null

        const setupSubscription = async () => {
            // Small delay to let Strict Mode mount/unmount cycle settle
            await new Promise(resolve => setTimeout(resolve, 500))
            if (!isApplied) return

            channel = supabase
                .channel('super-admin-orders-realtime')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'orders' },
                    () => {
                        console.log("[SuperAdmin Realtime] Orders changed, invalidating cache...")
                        queryClient.invalidateQueries({ queryKey: ['super-admin', 'orders'] })
                        queryClient.invalidateQueries({ queryKey: ['super-admin', 'order-stats'] })
                    }
                )
                .subscribe()
        }

        setupSubscription()

        return () => {
            isApplied = false
            if (channel) {
                supabase.removeChannel(channel)
            }
        }
    }, [queryClient, supabase])

    return {
        orders: orders || [],
        stats: stats || { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, completedOrders: 0 },
        stores: stores || [],
        isLoading: isLoadingOrders || isLoadingStats || isLoadingStores
    }
}
