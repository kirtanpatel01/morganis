"use client"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import Link from 'next/link'
import React from 'react'
import { IconDashboard, IconSettings, IconPackage, IconShoppingCart, IconCreditCard } from '@tabler/icons-react'
import { Separator } from './ui/separator'
import { Moon } from 'lucide-react'
import { usePathname } from 'next/navigation'

function AdminSidebar() {
  const pathname = usePathname();

  const adminRoutes = [
    { title: "Dashboard", url: "/admin/dashboard", icon: IconDashboard },
    { title: "Products", url: "/admin/products", icon: IconPackage },
    { title: "Orders", url: "/admin/orders", icon: IconShoppingCart },
    { title: "Payment History", url: "/admin/payment-history", icon: IconCreditCard },
    { title: "Settings", url: "/admin/dashboard", icon: IconSettings },
  ]
  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin">
                <Moon />
                <span className="font-semibold text-lg">Morganiz</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminRoutes.map((item) => {
                const isActive = pathname === item.url;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                    >
                      <Link href={item.url}>
                        <Icon />
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
    </Sidebar>
  )
}

export default AdminSidebar