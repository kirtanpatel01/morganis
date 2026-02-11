"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import {
    DialogClose,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { updateStoreSchema, type UpdateStoreInput } from "../schemas"
import type { Store } from "../types"
import { updateStore } from "../actions"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

export function EditStoreDialogContent({ store }: { store: Store | null }) {
    const form = useForm<UpdateStoreInput>({
        resolver: zodResolver(updateStoreSchema),
        defaultValues: {
            id: store?.id || "",
            name: store?.name || "",
            gstin: store?.gstin || "",
            address: store?.address || "",
            stateCode: store?.state_code || "",
            status: store?.status || "pending",
        },
    })

    useEffect(() => {
        if (store) {
            form.reset({
                id: store.id,
                name: store.name,
                gstin: store.gstin,
                address: store.address,
                stateCode: store.state_code,
                status: store.status,
            })
        }
    }, [store, form])

    const onSubmit = async (data: UpdateStoreInput) => {
        const result = await updateStore(data);
        if (result.success) {
            toast.success("Store updated successfully")
        } else {
            toast.error(result.message)
        }
    }

    return (
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Edit Store</DialogTitle>
                <DialogDescription>
                    Update store information. Store ID: {store?.id}
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
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={form.formState.isSubmitting}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="cursor-pointer"
                        >
                            {form.formState.isSubmitting && <Spinner />}
                            Update Store
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}
