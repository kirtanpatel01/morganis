"use client"

import { useState } from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import type { Store } from "../types"

interface StoreManagementTableProps {
    stores: Store[]
    onCreateStore?: () => void
}

export function StoreManagementTable({ stores, onCreateStore }: StoreManagementTableProps) {
    const getStatusBadge = (status: Store["status"]) => {
        switch (status) {
            case "active":
                return <Badge className="bg-slate-900 hover:bg-slate-800 text-white">active</Badge>
            case "inactive":
                return <Badge variant="secondary">inactive</Badge>
            case "pending":
                return <Badge variant="outline" className="text-yellow-600 border-yellow-600">pending</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
        })
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Store Management</CardTitle>
                <Button onClick={onCreateStore} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Store & Admin
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Store ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>GSTIN</TableHead>
                            <TableHead className="max-w-[300px]">Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stores.map((store) => (
                            <TableRow key={store.id}>
                                <TableCell className="font-mono text-sm text-muted-foreground">
                                    {store.storeId}
                                </TableCell>
                                <TableCell className="font-medium text-blue-600 hover:underline cursor-pointer">
                                    {store.name}
                                </TableCell>
                                <TableCell className="font-mono text-sm">
                                    {store.gstin}
                                </TableCell>
                                <TableCell className="max-w-[300px] truncate">
                                    {store.address}
                                </TableCell>
                                <TableCell>{getStatusBadge(store.status)}</TableCell>
                                <TableCell>{formatDate(store.createdAt)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
