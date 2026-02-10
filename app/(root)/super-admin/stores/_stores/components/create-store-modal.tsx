"use client"

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
import { Loader2 } from "lucide-react"

import { createStoreSchema, type CreateStoreInput } from "../schemas"
import { useStoreMutations } from "../../_hooks/use-store-mutations"
import { toast } from "sonner"



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
    const { createStore, isLoading } = useStoreMutations({
        onSuccess: onStoreCreated,
    })

    const form = useForm<CreateStoreInput>({
        resolver: zodResolver(createStoreSchema),
        shouldUnregister: true,
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
        const result = await createStore(data)

        if (result?.success) {
            toast.success("Store has been created successfully")
            form.reset()
            onOpenChange(false)
        } else {
            toast.error(result?.message ?? "Failed to create store")
        }
    }


    const handleDialogChange = (nextOpen: boolean) => {
        if (!nextOpen && !isLoading) {
            form.reset()
        }
        onOpenChange(nextOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Store & Admin</DialogTitle>
                    <DialogDescription>
                        Enter store details and admin credentials.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
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
                                                onChange={(e) =>
                                                    field.onChange(e.target.value.toUpperCase())
                                                }
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
                                        <Input placeholder="123 Main St" {...field} />
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
                                                onChange={(e) =>
                                                    field.onChange(e.target.value.toUpperCase())
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="adminEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Admin Email *</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="adminPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Admin Password *</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isLoading}
                                onClick={() => handleDialogChange(false)}
                            >
                                Cancel
                            </Button>

                            <Button type="submit" disabled={isLoading} >
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create Store
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
