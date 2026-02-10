// Notification types and interfaces

export type NotificationType = "info" | "success" | "warning" | "error"
export type NotificationStatus = "read" | "unread"

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  status: NotificationStatus
  timestamp: string
  link?: string
  icon?: React.ReactNode
}

export interface NotificationGroup {
  date: string
  notifications: Notification[]
}
