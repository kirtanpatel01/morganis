"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { IconSearch, IconShoppingCart } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useCartStore } from "./cart-store"
import { useEffect, useState } from "react"

export function PosNavbar() {
  const { toggleCart, items } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)
  }, [])

  const itemCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0

  // Search Logic
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("search", term)
    } else {
      params.delete("search")
    }
    // Shallow update
    router.replace(`/?${params.toString()}`, { scroll: false })
  }

  const isRoot = pathname === "/"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background px-4">
      <div className="flex h-14 items-center">
        <div className="flex-1 md:flex-none">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:text-xl text-lg inline-block">
              Morganiz
            </span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {isRoot && (
              <div className="relative w-full md:w-64 lg:w-80">
                <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stores..."
                  className="pl-8 h-9"
                  defaultValue={searchParams.get("search")?.toString()}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            )}
          </div>
          <nav className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" className="relative" aria-label="Cart" onClick={toggleCart}>
              <IconShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600 ring-2 ring-background"></span>
              )}
            </Button>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  )
}
