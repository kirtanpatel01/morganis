"use client"

import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarGroupLabel,
  SidebarRail
} from './ui/sidebar'
import { 
  IconDashboard, 
  IconSettings, 
  IconPackage, 
  IconShoppingCart, 
  IconCreditCard, 
  IconUsers 
} from '@tabler/icons-react'
import Link from 'next/link'
import { Store } from 'lucide-react'
import { usePathname } from 'next/navigation'

function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              asChild
            >
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Store className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Morganis</span>
                  <span className="truncate text-xs">Store Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminRoutes.map((item) => (
                <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

export default AdminSidebar