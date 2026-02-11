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
import { MoreHorizontal, Pencil, Power, PowerOff, Trash } from "lucide-react"
import type { Store } from "../types"
import { EditStoreDialogContent } from "./edit-store-dialog-content"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toggleStoreStatus } from "../actions"
import { DeleteStoreDialogContent } from "./delete-store-dialog-content"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"

export function StoresTable({ stores }: { stores: Store[] }) {
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
                        <TableHead>Store Name</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>GSTIN</TableHead>
                        <TableHead>State Code</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stores.map((store) => (
                        <TableRow key={store.id}>
                            <TableCell className="font-medium">{store.name}</TableCell>
                            <TableCell>{store.owner_name || "-"}</TableCell>
                            <TableCell className="font-mono text-sm">{store.gstin}</TableCell>
                            <TableCell>{store.state_code}</TableCell>
                            <TableCell>{getStatusBadge(store.status)}</TableCell>
                            <TableCell>
                                <Dialog>
                                    <AlertDialog>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <DialogTrigger asChild>
                                                        <span className="cursor-pointer w-full flex items-center gap-2"><Pencil />
                                                            Edit</span>
                                                    </DialogTrigger>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={async () => await toggleStoreStatus(store)} className="cursor-pointer">
                                                    {store.status === "active" ? (
                                                        <>
                                                            <PowerOff className="h-4 w-4" />
                                                            Deactivate
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Power className="h-4 w-4" />
                                                            Activate
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem variant="destructive">
                                                    <AlertDialogTrigger asChild>
                                                        <span className="w-full cursor-pointer flex items-center gap-2"><Trash />
                                                            Delete</span>
                                                    </AlertDialogTrigger>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <EditStoreDialogContent store={store} />
                                        <DeleteStoreDialogContent storeId={store.id} storeName={store.name} />
                                    </AlertDialog>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
