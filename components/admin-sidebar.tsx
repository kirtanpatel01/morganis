"use client"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from './ui/sidebar'
import Link from 'next/link'
import React from 'react'
import { IconDashboard, IconSettings, IconPackage, IconShoppingCart, IconCreditCard, IconUsers } from '@tabler/icons-react'
import { Separator } from './ui/separator'
import { Moon, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

function AdminSidebar() {
  const pathname = usePathname();

  const adminRoutes = [
    { title: "Dashboard", url: "/admin/dashboard", icon: IconDashboard },
    { title: "Products", url: "/admin/products", icon: IconPackage },
    { title: "Orders", url: "/admin/orders", icon: IconShoppingCart },
    { title: "Payments", url: "/admin/payments", icon: IconCreditCard },
    { title: "Staff", url: "/admin/staff", icon: IconUsers },
    { title: "Settings", url: "/admin/settings", icon: IconSettings },
  ]

  return (
    <Sidebar collapsible='icon' variant="sidebar">
      <SidebarHeader className="h-16 border-b border-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0 hover:bg-transparent hover:text-primary">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Moon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Morganis</span>
                  <span className="truncate text-xs">Admin Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {adminRoutes.map((item) => {
                const isActive = pathname === item.url || (item.url !== '/admin/dashboard' && pathname?.startsWith(item.url));
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-200 ease-in-out",
                        isActive && "font-medium bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      )}
                    >
                      <Link href={item.url}>
                        <Icon className={cn("size-4", isActive && "text-primary")} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <Link href="/logout"> {/* Placeholder logout link */}
                <LogOut className="size-4" />
                <span>Log out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AdminSidebar