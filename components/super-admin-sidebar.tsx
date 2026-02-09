"use client"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuItem } from './ui/sidebar'
import Link from 'next/link'
import React from 'react'
import { IconDashboard, IconSettings, IconPackage, IconShoppingCart, IconCreditCard } from '@tabler/icons-react'

function SuperAdminSidebar() {
  const superAdminRoutes = [
    { title: "Dashboard", href: "/dashboard", icon: <IconDashboard /> },
    { title: "Stores", href: "/stores", icon: <IconPackage /> },
    { title: "Products", href: "/products", icon: <IconPackage /> },
    { title: "Orders", href: "/orders", icon: <IconShoppingCart /> },
    { title: "Sales", href: "/sales", icon: <IconCreditCard /> },
    { title: "Settings", href: "/dashboard", icon: <IconSettings /> },
  ]
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/super-admin">
              Super Admin
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {superAdminRoutes.map((route) => (
                <SidebarMenuItem key={route.title}>
                  <Link href={route.href}>
                    {route.icon}
                    {route.title}
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default SuperAdminSidebar