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
import { updateAdminSchema, type UpdateAdminFormValues } from "../schemas"
import type { Admin } from "../types"
import { updateAdmin } from "../actions"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

export function EditAdminDialogContent({ admin }: { admin: Admin }) {
    const form = useForm<UpdateAdminFormValues>({
        resolver: zodResolver(updateAdminSchema),
        defaultValues: {
            name: admin.name || "",
            email: admin.email || "",
            password: "",
        },
    })

    useEffect(() => {
        if (admin) {
            form.reset({
                name: admin.name,
                email: admin.email,
                password: "",
            })
        }
    }, [admin, form])

    const onSubmit = async (data: UpdateAdminFormValues) => {
        const result = await updateAdmin(admin.id, data);
        if (result.success) {
            toast.success("Admin updated successfully")
            // Optionally close dialog if controlled, but usually handled by parent state or Dialog behavior
        } else {
            toast.error(result.message)
        }
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit Admin</DialogTitle>
                <DialogDescription>
                    Update admin details. Leave password blank to keep current one.
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                    <Input placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Enter new password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                            Update Admin
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}
