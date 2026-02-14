import type { NotificationType } from "@/lib/actions/notifications";

export type { NotificationType }; // Re-export for convenience

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}
