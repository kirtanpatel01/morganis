"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type NotificationType =
  | "store_created"
  | "store_status_changed"
  | "store_updated"
  | "profile_updated"
  | "info"
  | "warning"
  | "error"
  | "success";

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: NotificationType,
  data?: Record<string, unknown>
) {
  const supabase = await createClient();

  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
    data,
    is_read: false,
  });

  if (error) {
    console.error("Failed to create notification:", error);
    // We don't throw here to avoid failing the main action (e.g. store creation)
    // just because notification failed.
  }
}

export async function markNotificationAsRead(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);

  if (error) {
    console.error("Failed to mark notification as read:", error);
    throw new Error("Failed to mark notification as read");
  }

  revalidatePath("/", "layout");
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to mark all notifications as read:", error);
    throw new Error("Failed to mark all notifications as read");
  }

  revalidatePath("/", "layout");
}

export async function getNotifications() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }

  return data;
}
