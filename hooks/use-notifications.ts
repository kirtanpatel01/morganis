"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/actions/notifications";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";
import type { Notification } from "@/types/notifications";

export function useNotifications() {
  const queryClient = useQueryClient();
  const supabase = createClient();

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
    let channel: any;

    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // We rely on RLS to filter notifications for the current user
      // so we can subscribe to the notifications table directly.
      // However, for efficiency, Supabase Realtime *client* filtering is often preferred if RLS isn't strict enough for "broadcast but hidden", 
      // but here we have strict RLS.
      // The issue might be that postgres_changes needs a subscriber (user) context if RLS is on?
      // Yes, 'createClient' in browser should have the user session.
      
      console.log("Setting up realtime subscription for user:", user.id);

      channel = supabase
        .channel(`user-notifications`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            // Remove filter to see if it receives *anything* (RLS should filter it anyway)
            // Or try filtering by user_id explicitly again but ensure type match.
            // UUIDs usually need quotes in filters? No, eq.uuid is fine.
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Realtime payload received:", payload);
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
        .subscribe((status, err) => {
            console.log("Subscription status:", status, err);
        });
    };

    setupRealtime();

    return () => {
      if (channel) {
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
