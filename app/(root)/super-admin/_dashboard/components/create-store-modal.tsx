"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createStoreSchema, type CreateStoreInput } from "../schemas"
import { createStore } from "../actions"

interface CreateStoreModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onStoreCreated?: () => void
}

export function CreateStoreModal({
    open,
    onOpenChange,
    onStoreCreated,
}: CreateStoreModalProps) {
    const form = useForm<CreateStoreInput>({
        resolver: zodResolver(createStoreSchema),
        mode: "onBlur",
        defaultValues: {
            name: "",
            gstin: "",
            address: "",
            stateCode: "",
            adminEmail: "",
            adminPassword: "",
        },
    })

    const onSubmit = async (data: CreateStoreInput) => {
        try {
            const result = await createStore(data)

            if (result.success) {
                toast.success(result.message || "Store created successfully")
                form.reset()
                onOpenChange(false)
                onStoreCreated?.()
            } else {
                toast.error(result.message || "Failed to create store")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
            console.error("Create store error:", error)
        }
    }

    const handleDialogChange = (nextOpen: boolean) => {
        if (!nextOpen && !form.formState.isSubmitting) {
            form.reset()
        }
        onOpenChange(nextOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Store & Admin Account</DialogTitle>
                    <DialogDescription>
                        Enter the details to create a new store and admin account.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Row 1: Store Name and GSTIN */}
                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Store Name *</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="My Restaurant"
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="gstin"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>GSTIN *</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="22AAAAA0000A1Z5"
                                        maxLength={15}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>

                    {/* Row 2: Store Address */}
                    <Controller
                        name="address"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Store Address *</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="123 Main St, City"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="street-address"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Row 3: State Code and Admin Email */}
                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="stateCode"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>State Code *</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="MH"
                                        maxLength={2}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="adminEmail"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Admin Email *</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="email"
                                        placeholder="admin@store.com"
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="email"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>

                    {/* Row 4: Admin Password */}
                    <Controller
                        name="adminPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Admin Password *</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="password"
                                    placeholder="Min. 8 characters (1 uppercase, 1 lowercase, 1 number)"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="new-password"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleDialogChange(false)}
                            disabled={form.formState.isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create Store
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
