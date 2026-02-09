import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import AdminSidebar from '@/components/admin-sidebar'
import { SiteHeader } from '@/components/site-header'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AdminSidebar />
      <main>
        <SiteHeader />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default layout