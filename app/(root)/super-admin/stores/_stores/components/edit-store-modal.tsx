"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateStore } from "../actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import type { Store } from "../types"

interface EditStoreModalProps {
    store: Store | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onStoreUpdated?: () => void
}

export function EditStoreModal({ store, open, onOpenChange, onStoreUpdated }: EditStoreModalProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        gstin: "",
        address: "",
        stateCode: "",
        status: "active" as "active" | "inactive" | "pending",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (store) {
            setFormData({
                name: store.name,
                gstin: store.gstin,
                address: store.address,
                stateCode: store.stateCode,
                status: store.status,
            })
            setErrors({})
        }
    }, [store])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = "Store name is required"
        }

        if (!formData.gstin.trim()) {
            newErrors.gstin = "GSTIN is required"
        } else if (formData.gstin.length !== 15) {
            newErrors.gstin = "GSTIN must be exactly 15 characters"
        }

        if (!formData.address.trim()) {
            newErrors.address = "Store address is required"
        }

        if (!formData.stateCode.trim()) {
            newErrors.stateCode = "State code is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!store || !validateForm()) {
            return
        }

        setLoading(true)
        try {
            const result = await updateStore({
                id: store.id,
                ...formData,
            })
            if (result.success) {
                toast.success(result.message)
                onOpenChange(false)
                onStoreUpdated?.()
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("Failed to update store")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Store</DialogTitle>
                    <DialogDescription>
                        Update store information. Store ID: {store?.storeId}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Store Name *</Label>
                            <Input
                                id="edit-name"
                                placeholder="My Restaurant"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-gstin">GSTIN *</Label>
                            <Input
                                id="edit-gstin"
                                placeholder="22AAAAA0000A1Z5"
                                maxLength={15}
                                value={formData.gstin}
                                onChange={(e) => handleChange("gstin", e.target.value.toUpperCase())}
                                className={errors.gstin ? "border-red-500" : ""}
                            />
                            {errors.gstin && <p className="text-xs text-red-500">{errors.gstin}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-address">Store Address *</Label>
                        <Input
                            id="edit-address"
                            placeholder="123 Main St, City"
                            value={formData.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            className={errors.address ? "border-red-500" : ""}
                        />
                        {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-stateCode">State Code *</Label>
                            <Input
                                id="edit-stateCode"
                                placeholder="MH"
                                maxLength={2}
                                value={formData.stateCode}
                                onChange={(e) => handleChange("stateCode", e.target.value.toUpperCase())}
                                className={errors.stateCode ? "border-red-500" : ""}
                            />
                            {errors.stateCode && <p className="text-xs text-red-500">{errors.stateCode}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleChange("status", value)}
                            >
                                <SelectTrigger id="edit-status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Store
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
