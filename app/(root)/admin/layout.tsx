// import { SidebarProvider } from '@/components/ui/sidebar'
// import React from 'react'
// import AdminSidebar from '@/components/admin-sidebar'
// import { SiteHeader } from '@/components/site-header'

// function layout({ children }: { children: React.ReactNode }) {
//   return (
//     <SidebarProvider
//       style={
//         {
//           "--sidebar-width": "calc(var(--spacing) * 72)",
//           "--header-height": "calc(var(--spacing) * 12)",
//         } as React.CSSProperties
//       }
//     >
//       <AdminSidebar />
//       <main>
//         <SiteHeader />
//         {children}
//       </main>
//     </SidebarProvider>
//   )
// }

// export default layout

"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

export default function StoreAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Simple breadcrumb generation based on path
  const pathSegments = pathname.split('/').filter(segment => segment !== '')
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`
    const isLast = index === pathSegments.length - 1
    const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')

    return { title, href, isLast }
  })

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/store-admin">
                    Store Admin
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.filter(b => b.href !== '/store-admin').map((breadcrumb, index) => (
                  <div key={breadcrumb.href} className="flex items-center gap-2">
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      {breadcrumb.isLast ? (
                        <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={breadcrumb.href}>
                          {breadcrumb.title}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
