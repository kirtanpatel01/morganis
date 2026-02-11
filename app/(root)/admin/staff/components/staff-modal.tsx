"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffSchema, StaffFormValues } from "./staff-schema";
import { useCreateStaff, useUpdateStaff } from "../hooks/use-staff";
import { Staff } from "../types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect } from "react";

interface StaffModalProps {
    initialData?: Staff;
    isOpen: boolean;
    onClose: () => void;
}

export function StaffModal({ initialData, isOpen, onClose }: StaffModalProps) {
    const { mutate: createStaff, isPending: isCreating } = useCreateStaff();
    const { mutate: updateStaff, isPending: isUpdating } = useUpdateStaff();

    const form = useForm<StaffFormValues>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            role: "cashier",
            status: "active",
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                email: initialData.email,
                phone: initialData.phone,
                role: initialData.role,
                status: initialData.status,
            });
        } else {
            form.reset({
                name: "",
                email: "",
                phone: "",
                role: "cashier",
                status: "active",
            });
        }
    }, [initialData, isOpen, form]);

    function onSubmit(data: StaffFormValues) {
        if (initialData) {
            updateStaff({ id: initialData.id, updates: data }, {
                onSuccess: () => {
                    toast.success("Staff updated successfully");
                    onClose();
                },
                onError: () => toast.error("Failed to update staff"),
            });
        } else {
            createStaff(data, { // id is generated
                onSuccess: () => {
                    toast.success("Staff added successfully");
                    onClose();
                },
                onError: () => toast.error("Failed to add staff"),
            });
        }
    }

    const isLoading = isCreating || isUpdating;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Staff" : "Add Staff"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Make changes to staff details." : "Add a new staff member to your team."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
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
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+1234567890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="manager">Manager</SelectItem>
                                                <SelectItem value="cashier">Cashier</SelectItem>
                                                <SelectItem value="kitchen">Kitchen</SelectItem>
                                                <SelectItem value="driver">Driver</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="leave">On Leave</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
