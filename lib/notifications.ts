import { Notification } from "@/types/notifications"
import { Store, ShoppingCart, AlertCircle, CheckCircle, Info } from "lucide-react"

// Mock notification data
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "New Store Created",
    message: "Paramjeet Restaurant has been successfully created",
    type: "success",
    status: "unread",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    link: "/super-admin/stores",
  },
  {
    id: "2",
    title: "Order Pending Approval",
    message: "Order #ORD-1234 from Shree Nath Bhavan is waiting for approval",
    type: "warning",
    status: "unread",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    link: "/super-admin/orders",
  },
  {
    id: "3",
    title: "Store Status Changed",
    message: "Venkatesh store has been marked as inactive",
    type: "info",
    status: "read",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    link: "/super-admin/stores",
  },
  {
    id: "4",
    title: "System Update",
    message: "New features have been added to the analytics dashboard",
    type: "info",
    status: "read",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    link: "/super-admin/analytics",
  },
  {
    id: "5",
    title: "Payment Failed",
    message: "Payment processing failed for Order #ORD-5678",
    type: "error",
    status: "read",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    link: "/super-admin/orders",
  },
]

// Helper function to get notification icon
export function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "success":
      return CheckCircle
    case "warning":
      return AlertCircle
    case "error":
      return AlertCircle
    case "info":
    default:
      return Info
  }
}

// Helper function to format timestamp
export function formatNotificationTime(timestamp: string): string {
  const now = new Date()
  const notificationDate = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "Just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? "day" : "days"} ago`
  } else {
    return notificationDate.toLocaleDateString()
  }
}
