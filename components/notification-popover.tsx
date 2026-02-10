"use client"

import * as React from "react"
import { Bell } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
    MOCK_NOTIFICATIONS,
    formatNotificationTime,
    getNotificationIcon,
} from "@/lib/notifications"
import type { Notification } from "@/types/notifications"

export function NotificationPopover() {
    const [notifications, setNotifications] = React.useState<Notification[]>(MOCK_NOTIFICATIONS)
    const [open, setOpen] = React.useState(false)

    const unreadCount = notifications.filter((n) => n.status === "unread").length

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, status: "read" as const } : n))
        )
    }

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, status: "read" as const }))
        )
    }

    const getNotificationColor = (type: Notification["type"]) => {
        switch (type) {
            case "success":
                return "text-green-500"
            case "warning":
                return "text-yellow-500"
            case "error":
                return "text-red-500"
            case "info":
            default:
                return "text-blue-500"
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                            onClick={markAllAsRead}
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>
                <Separator />
                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Bell className="h-12 w-12 text-muted-foreground/50 mb-2" />
                            <p className="text-sm text-muted-foreground">No notifications</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => {
                                const Icon = getNotificationIcon(notification.type)
                                const isUnread = notification.status === "unread"

                                return (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "p-4 hover:bg-accent/50 transition-colors cursor-pointer",
                                            isUnread && "bg-accent/30"
                                        )}
                                        onClick={() => {
                                            markAsRead(notification.id)
                                            if (notification.link) {
                                                setOpen(false)
                                            }
                                        }}
                                    >
                                        {notification.link ? (
                                            <Link href={notification.link} className="block">
                                                <NotificationContent
                                                    notification={notification}
                                                    Icon={Icon}
                                                    isUnread={isUnread}
                                                    getNotificationColor={getNotificationColor}
                                                />
                                            </Link>
                                        ) : (
                                            <NotificationContent
                                                notification={notification}
                                                Icon={Icon}
                                                isUnread={isUnread}
                                                getNotificationColor={getNotificationColor}
                                            />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </ScrollArea>
                {notifications.length > 0 && (
                    <>
                        <Separator />
                        <div className="p-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs"
                                asChild
                            >
                                <Link href="/super-admin/notifications">View all notifications</Link>
                            </Button>
                        </div>
                    </>
                )}
            </PopoverContent>
        </Popover>
    )
}

function NotificationContent({
    notification,
    Icon,
    isUnread,
    getNotificationColor,
}: {
    notification: Notification
    Icon: React.ComponentType<{ className?: string }>
    isUnread: boolean
    getNotificationColor: (type: Notification["type"]) => string
}) {
    return (
        <div className="flex gap-3">
            <div className={cn("mt-1", getNotificationColor(notification.type))}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm font-medium", isUnread && "font-semibold")}>
                        {notification.title}
                    </p>
                    {isUnread && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">
                    {formatNotificationTime(notification.timestamp)}
                </p>
            </div>
        </div>
    )
}
