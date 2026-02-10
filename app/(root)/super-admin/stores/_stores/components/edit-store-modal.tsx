"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { updateStoreSchema, type UpdateStoreInput } from "../schemas"
import { useStoreMutations } from "../../_hooks/use-store-mutations"
import type { Store } from "../types"

interface EditStoreModalProps {
    store: Store | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onStoreUpdated?: () => void
}

export function EditStoreModal({ store, open, onOpenChange, onStoreUpdated }: EditStoreModalProps) {
    const { updateStore, isLoading } = useStoreMutations({
        onSuccess: onStoreUpdated,
    })

    const form = useForm<UpdateStoreInput>({
        resolver: zodResolver(updateStoreSchema),
        defaultValues: {
            id: "",
            name: "",
            gstin: "",
            address: "",
            stateCode: "",
            status: "active",
        },
    })

    // Update form when store changes
    useEffect(() => {
        if (store) {
            form.reset({
                id: store.id,
                name: store.name,
                gstin: store.gstin,
                address: store.address,
                stateCode: store.stateCode,
                status: store.status,
            })
        }
    }, [store, form])

    const onSubmit = async (data: UpdateStoreInput) => {
        const result = await updateStore(data)
        if (result.success) {
            onOpenChange(false)
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

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Store Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="My Restaurant" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gstin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>GSTIN *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="22AAAAA0000A1Z5"
                                                maxLength={15}
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store Address *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123 Main St, City" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="stateCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State Code *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="MH"
                                                maxLength={2}
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Store
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
