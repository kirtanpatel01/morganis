"use client"

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { getOrders, updateOrderStatus } from "../actions"
import { toast } from "sonner"
import type { Database } from "../../../../../types/supabase"

type Order = Database["public"]["Tables"]["orders"]["Row"] & {
    order_items: Database["public"]["Tables"]["order_items"]["Row"][]
}

export function useOrders(initialData?: Order[]) {
    const queryClient = useQueryClient()
    const supabase = useMemo(() => createClient(), [])

    const { data: orders, isLoading, error } = useQuery({
        queryKey: ["admin-orders"],
        queryFn: async () => {
            const result = await getOrders()
            if (result.error) throw new Error(result.error || "Failed to fetch orders")
            return result.orders as Order[]
        },
        initialData: initialData,
        staleTime: 1000 * 60, // 1 minute
    })

    useEffect(() => {
        // Subscribe to orders changes
        const channel = supabase
            .channel("realtime-orders")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "orders",
                },
                (payload: { [key: string]: unknown }) => {
                    console.log("Realtime update:", payload)
                    // Invalidate and refetch
                    queryClient.invalidateQueries({ queryKey: ["admin-orders"] })
                    
                    if (payload.eventType === 'INSERT') {
                        toast.info("New order received!")
                        // TODO: Play sound
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [queryClient, supabase])

    return { orders, isLoading, error, refetch: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }) }
}

export function useUpdateOrder() {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: async ({ id, status, rejectionReason }: { id: string, status: string, rejectionReason?: string }) => {
            const result = await updateOrderStatus(id, status, rejectionReason)
            if (!result.success) throw new Error(result.error || "Failed to update status")
            return result
        },
        onSuccess: () => {
             // Invalidate the orders query to refetch data
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] })
        }
    })
}
