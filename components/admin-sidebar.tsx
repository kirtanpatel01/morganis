import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuItem } from './ui/sidebar'
import Link from 'next/link'
import { IconDashboard, IconSettings, IconPackage, IconShoppingCart, IconCreditCard } from '@tabler/icons-react'

function AdminSidebar() {
  const adminRoutes = [
    { title: "Dashboard", href: "/dashboard", icon: <IconDashboard /> },
    { title: "Products", href: "/products", icon: <IconPackage /> },
    { title: "Orders", href: "/orders", icon: <IconShoppingCart /> },
    { title: "Payment History", href: "/payment-history", icon: <IconCreditCard /> },
    { title: "Settings", href: "/dashboard", icon: <IconSettings /> },
  ]
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/admin">
              Admin
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminRoutes.map((route) => (
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

export default AdminSidebar