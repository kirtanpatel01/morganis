import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import AdminSidebar from '@/components/admin-sidebar'
import { SiteHeader } from '@/components/site-header'
import { getCurrentAdmin } from "@/app/auth/admin-login/action"

async function layout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  const user = {
    name: admin?.name || "Admin",
    email: admin?.email || "",
    avatar: admin?.avatar || undefined,
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 40)",
          "--header-height": "calc(var(--spacing) * 16)",
        } as React.CSSProperties
      }
    >
      <AdminSidebar />
      <main className='w-full'>
        <SiteHeader user={user} />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default layout