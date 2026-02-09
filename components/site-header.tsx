'use client'

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle"
import { IconBell, IconUser } from "@tabler/icons-react"

export function SiteHeader() {
  const pathname = usePathname() || "";
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {segments.flatMap((segment, index) => {
              const href = `/${segments.slice(0, index + 1).join("/")}`;
              const isLast = index === segments.length - 1;
              const label = segment.charAt(0).toUpperCase() + segment.slice(1);

              return [
                <BreadcrumbItem key={href}>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>,
                !isLast ? <BreadcrumbSeparator key={`${href}-sep`} /> : null
              ].filter((item): item is React.ReactElement => Boolean(item));
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <IconBell />
            </Button>
            <Button variant="ghost" size="icon">
              <IconUser />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
