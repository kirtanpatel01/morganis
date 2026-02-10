"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { StoresTable, CreateStoreModal, EditStoreModal, DeleteStoreDialog } from "./_stores/components"
import { getStores, deleteStore, toggleStoreStatus } from "./_stores/actions"
import type { Store, StoreFilters } from "./_stores/types"

export default function StoresPage() {
    const [stores, setStores] = useState<Store[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState<StoreFilters>({ search: "", status: "all" })

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedStore, setSelectedStore] = useState<Store | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const fetchStores = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getStores(filters)
            setStores(data)
        } catch (error) {
            console.error("Failed to fetch stores:", error)
            toast.error("Failed to load stores")
        } finally {
            setLoading(false)
        }
    }, [filters])

    useEffect(() => {
        fetchStores()
    }, [fetchStores])

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
                toast.success(result.message)
                setIsDeleteDialogOpen(false)
                setSelectedStore(null)
                fetchStores()
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("Failed to delete store")
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleToggleStatus = async (store: Store) => {
        try {
            const result = await toggleStoreStatus(store.id)
            if (result.success) {
                toast.success(result.message)
                fetchStores()
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("Failed to update store status")
        }
    }

    const handleSearchChange = (value: string) => {
        setFilters((prev) => ({ ...prev, search: value }))
    }

    const handleStatusFilterChange = (value: string) => {
        setFilters((prev) => ({ ...prev, status: value as StoreFilters["status"] }))
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Store Management</CardTitle>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Store
                    </Button>
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
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={filters.status} onValueChange={handleStatusFilterChange}>
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
                            <Button variant="outline" size="icon" onClick={fetchStores} disabled={loading}>
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
                        <StoresTable
                            stores={stores}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                        />
                    )}

                    {/* Store count */}
                    <div className="text-sm text-muted-foreground">
                        Total: {stores.length} store{stores.length !== 1 ? "s" : ""}
                    </div>
                </CardContent>
            </Card>

            {/* Modals */}
            <CreateStoreModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onStoreCreated={fetchStores}
            />

            <EditStoreModal
                store={selectedStore}
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onStoreUpdated={fetchStores}
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