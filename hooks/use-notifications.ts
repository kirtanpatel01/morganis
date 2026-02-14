"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../lib/actions/notifications";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import type { Notification } from "../types/notifications";

export function useNotifications() {
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createClient(), []);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const data = await getNotifications();
      // Ensure we typecast or validate data if needed, but for now assuming it matches
      return data as Notification[];
    },
    // initialData: [],
  });

  useEffect(() => {
    let isApplied = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isApplied) return;

      console.log("[Notifications] Setting up realtime for user:", user.id);

      channel = supabase
        .channel(`user-notifications`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload: { [key: string]: any }) => {
            console.log("[Notifications] Payload received:", payload);
            const newNotification = payload.new as Notification;

            queryClient.setQueryData<Notification[]>(["notifications"], (old) => {
              const safeOld = old || [];
              if (safeOld.some((n) => n.id === newNotification.id)) return safeOld;
              return [newNotification, ...safeOld];
            });

            toast.info(newNotification.title, {
              description: newNotification.message,
            });
          }
        )
        .subscribe((status: string, err?: Error) => {
          console.log("[Notifications] Subscription status:", status, err);
        });
    };

    setupRealtime();

    return () => {
      isApplied = false;
      if (channel) {
        console.log("[Notifications] Cleaning up subscription");
        supabase.removeChannel(channel);
      }
    };
  }, [queryClient, supabase]);

  const markAsRead = async (id: string) => {
    // Optimistic update
    queryClient.setQueryData<Notification[]>(["notifications"], (old) =>
      old?.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    await markNotificationAsRead(id);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const markAllAsRead = async () => {
    // Optimistic update
    queryClient.setQueryData<Notification[]>(["notifications"], (old) =>
      old?.map((n) => ({ ...n, is_read: true }))
    );
    await markAllNotificationsAsRead();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
  };
}
