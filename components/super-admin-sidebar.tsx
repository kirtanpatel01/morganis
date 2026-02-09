"use client"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import Link from 'next/link'
import React from 'react'
import { IconDashboard, IconSettings, IconPackage, IconShoppingCart, IconCreditCard } from '@tabler/icons-react'
import { Separator } from './ui/separator'
import { Moon } from 'lucide-react'
import { usePathname } from 'next/navigation'

function SuperAdminSidebar() {
  const pathname = usePathname();

  const superAdminRoutes = [
    { title: "Dashboard", url: "/super-admin/dashboard", icon: IconDashboard },
    { title: "Stores", url: "/super-admin/stores", icon: IconPackage },
    { title: "Products", url: "/super-admin/products", icon: IconPackage },
    { title: "Orders", url: "/super-admin/orders", icon: IconShoppingCart },
    { title: "Sales", url: "/super-admin/sales", icon: IconCreditCard },
    { title: "Settings", url: "/super-admin/dashboard", icon: IconSettings },
  ]
  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/super-admin">
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
							{superAdminRoutes.map((item) => {
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

export default SuperAdminSidebar