"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeSettingsSchema, StoreSettingsValues } from "./settings-schemas";
import { useStoreSettings, useUpdateStoreSettings } from "../hooks/use-settings";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function StoreSettingsForm() {
    const { data: settings, isLoading } = useStoreSettings();
    const { mutate: updateSettings, isPending } = useUpdateStoreSettings();

    const form = useForm<StoreSettingsValues>({
        resolver: zodResolver(storeSettingsSchema),
        defaultValues: {
            name: "",
            description: "",
            address: "",
            phone: "",
            email: "",
            currency: "USD",
            taxRate: 0,
        },
    });

    useEffect(() => {
        if (settings) {
            form.reset(settings);
        }
    }, [settings, form]);

    function onSubmit(data: StoreSettingsValues) {
        updateSettings(data, {
            onSuccess: () => toast.success("Store settings updated"),
            onError: () => toast.error("Failed to update settings"),
        });
    }

    if (isLoading) return <div>Loading settings...</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Store Settings</CardTitle>
                <CardDescription>Manage your stores public details and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="My Store" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Tell us about your store" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="taxRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tax Rate (%)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
