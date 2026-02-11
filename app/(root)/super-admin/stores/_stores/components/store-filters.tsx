"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Search } from "lucide-react"

export function StoreFilters() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const initialSearch = searchParams.get("search") || ""
    const initialStatus = searchParams.get("status") || "all"

    const [search, setSearch] = useState(initialSearch)
    const [status, setStatus] = useState(initialStatus)

    const debouncedSearch = useDebounce(search, 500)

    // Sync URL with filters
    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        
        if (debouncedSearch) {
            params.set("search", debouncedSearch)
        } else {
            params.delete("search")
        }

        if (status && status !== "all") {
            params.set("status", status)
        } else {
            params.delete("status")
        }

        const currentString = searchParams.toString()
        const newString = params.toString()

        if (currentString !== newString) {
            startTransition(() => {
                router.push(`?${newString}`)
            })
        }
    }, [debouncedSearch, status, router, searchParams])

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by name, ID, GSTIN, or email..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex gap-2">
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
