import { SiteHeader } from "@/components/site-header"
import SuperAdminSidebar from "@/components/super-admin-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { getCurrentAdmin } from "@/app/auth/admin-login/action"

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getCurrentAdmin()

  const user = {
    name: admin?.name || "Admin",
    email: admin?.email || "",
    avatar: admin?.avatar || undefined,
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 56)",
          "--header-height": "calc(var(--spacing) * 16)",
        } as React.CSSProperties
      }
    >
      <SuperAdminSidebar />
      <main className='w-full'>
        <SiteHeader user={user} />
        {children}
      </main>
    </SidebarProvider>
  )
}