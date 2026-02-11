"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Power, PowerOff } from "lucide-react"
import type { Store } from "../types"

interface StoresTableProps {
    stores: Store[]
    onEdit: (store: Store) => void
    onDelete: (store: Store) => void
    onToggleStatus: (store: Store) => void
}

export function StoresTable({ stores, onEdit, onDelete, onToggleStatus }: StoresTableProps) {
    const getStatusBadge = (status: Store["status"]) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-600 hover:bg-green-700 text-white">Active</Badge>
            case "inactive":
                return <Badge variant="secondary" className="bg-gray-200 text-gray-700">Inactive</Badge>
            case "pending":
                return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    if (stores.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">No stores found</p>
            </div>
        )
    }

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>GSTIN</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stores.map((store) => (
                        <TableRow key={store.id}>
                            <TableCell className="font-medium">{store.name}</TableCell>
                            <TableCell className="font-mono text-sm">{store.gstin}</TableCell>
                            <TableCell>{store.stateCode}</TableCell>
                            <TableCell>{getStatusBadge(store.status)}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEdit(store)}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onToggleStatus(store)}>
                                            {store.status === "active" ? (
                                                <>
                                                    <PowerOff className="mr-2 h-4 w-4" />
                                                    Deactivate
                                                </>
                                            ) : (
                                                <>
                                                    <Power className="mr-2 h-4 w-4" />
                                                    Activate
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => onDelete(store)}
                                            className="text-red-600 focus:text-red-600"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
