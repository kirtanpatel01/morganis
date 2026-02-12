import { Notification } from "@/types/notifications"
import { Store, ShoppingCart, AlertCircle, CheckCircle, Info } from "lucide-react"

// Mock notification data - REPLACED BY DATABASE & REACT QUERY
// Kept temporarily for reference but emptied/commented to avoid type errors with old schema

// Helper function to get notification icon
export function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "success":
    case "store_created":
      return CheckCircle
    case "warning":
      return AlertCircle
    case "error":
      return AlertCircle
    case "info":
    case "store_status_changed":
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
