"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, RefreshCw } from "lucide-react"

import { StoresTable, CreateStoreModal, EditStoreModal, DeleteStoreDialog, Pagination } from "./_stores/components"
import { useStores } from "./_hooks/use-stores"
import { useStoreFilters } from "./_hooks/use-store-filters"
import { useStoreMutations } from "./_hooks/use-store-mutations"
import type { Store } from "./_stores/types"

export default function StoresPage() {
    // Filter management
    const { filters, debouncedFilters, setSearch, setStatus } = useStoreFilters()

    // Data fetching with pagination
    const { stores, loading, pagination, refetch } = useStores({
        filters: debouncedFilters,
        pageSize: 10,
    })

    // Mutations
    const { deleteStore, toggleStatus } = useStoreMutations({
        onSuccess: refetch,
    })

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedStore, setSelectedStore] = useState<Store | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Handlers
    const handleEdit = (store: Store) => {
        setSelectedStore(store)
        setIsEditModalOpen(true)
    }

    const handleDelete = (store: Store) => {
        setSelectedStore(store)
        setIsDeleteDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedStore) return

        setDeleteLoading(true)
        try {
            const result = await deleteStore(selectedStore.id)
            if (result.success) {
                setIsDeleteDialogOpen(false)
                setSelectedStore(null)
            }
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleToggleStatus = async (store: Store) => {
        await toggleStatus(store.id)
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Store Management</CardTitle>
                    <CreateStoreModal />
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, ID, GSTIN, or email..."
                                className="pl-9"
                                value={filters.search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={filters.status} onValueChange={setStatus}>
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
                            <Button variant="outline" size="icon" onClick={refetch} disabled={loading}>
                                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-muted-foreground">Loading stores...</div>
                        </div>
                    ) : (
                        <>
                            <StoresTable
                                stores={stores}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggleStatus={handleToggleStatus}
                            />

                            {/* Pagination */}
                            <Pagination {...pagination} className="pt-4" />
                        </>
                    )}
                </CardContent>
            </Card>

            <EditStoreModal
                store={selectedStore}
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onStoreUpdated={refetch}
            />

            <DeleteStoreDialog
                store={selectedStore}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
            />
        </div>
    )
}