"use client"

import { useState } from "react"
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
import { createStore } from "../actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface CreateStoreModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onStoreCreated?: () => void
}

export function CreateStoreModal({ open, onOpenChange, onStoreCreated }: CreateStoreModalProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        gstin: "",
        address: "",
        stateCode: "",
        adminEmail: "",
        adminPassword: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

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

        if (!formData.adminEmail.trim()) {
            newErrors.adminEmail = "Admin email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
            newErrors.adminEmail = "Invalid email address"
        }

        if (!formData.adminPassword.trim()) {
            newErrors.adminPassword = "Admin password is required"
        } else if (formData.adminPassword.length < 8) {
            newErrors.adminPassword = "Password must be at least 8 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)
        try {
            const result = await createStore({
                name: formData.name,
                gstin: formData.gstin,
                address: formData.address,
                stateCode: formData.stateCode,
                adminEmail: formData.adminEmail,
                adminPassword: formData.adminPassword,
            })
            if (result.success) {
                toast.success(result.message)
                onOpenChange(false)
                setFormData({
                    name: "",
                    gstin: "",
                    address: "",
                    stateCode: "",
                    adminEmail: "",
                    adminPassword: "",
                })
                setErrors({})
                onStoreCreated?.()
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("Failed to create store")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Store & Admin Account</DialogTitle>
                    <DialogDescription>
                        Enter the details to create a new store and admin account.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: Store Name and GSTIN */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Store Name *</Label>
                            <Input
                                id="name"
                                placeholder="My Restaurant"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gstin">GSTIN *</Label>
                            <Input
                                id="gstin"
                                placeholder="22AAAAA0000A1Z5"
                                maxLength={15}
                                value={formData.gstin}
                                onChange={(e) => handleChange("gstin", e.target.value.toUpperCase())}
                                className={errors.gstin ? "border-red-500" : ""}
                            />
                            {errors.gstin && (
                                <p className="text-xs text-red-500">{errors.gstin}</p>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Store Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Store Address *</Label>
                        <Input
                            id="address"
                            placeholder="123 Main St, City"
                            value={formData.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            className={errors.address ? "border-red-500" : ""}
                        />
                        {errors.address && (
                            <p className="text-xs text-red-500">{errors.address}</p>
                        )}
                    </div>

                    {/* Row 3: State Code and Admin Email */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="stateCode">State Code *</Label>
                            <Input
                                id="stateCode"
                                placeholder="MH"
                                maxLength={2}
                                value={formData.stateCode}
                                onChange={(e) => handleChange("stateCode", e.target.value.toUpperCase())}
                                className={errors.stateCode ? "border-red-500" : ""}
                            />
                            {errors.stateCode && (
                                <p className="text-xs text-red-500">{errors.stateCode}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="adminEmail">Admin Email *</Label>
                            <Input
                                id="adminEmail"
                                type="email"
                                placeholder="admin@store.com"
                                value={formData.adminEmail}
                                onChange={(e) => handleChange("adminEmail", e.target.value)}
                                className={errors.adminEmail ? "border-red-500" : ""}
                            />
                            {errors.adminEmail && (
                                <p className="text-xs text-red-500">{errors.adminEmail}</p>
                            )}
                        </div>
                    </div>

                    {/* Row 4: Admin Password */}
                    <div className="space-y-2">
                        <Label htmlFor="adminPassword">Admin Password *</Label>
                        <Input
                            id="adminPassword"
                            type="password"
                            placeholder="Min. 8 characters"
                            value={formData.adminPassword}
                            onChange={(e) => handleChange("adminPassword", e.target.value)}
                            className={errors.adminPassword ? "border-red-500" : ""}
                        />
                        {errors.adminPassword && (
                            <p className="text-xs text-red-500">{errors.adminPassword}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Store
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
