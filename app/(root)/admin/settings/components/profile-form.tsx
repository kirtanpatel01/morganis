"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileValues } from "./settings-schemas";
import { updateProfileSettings } from "../actions";
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
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileForm({ initialData }: { initialData: ProfileValues | null }) {
    const [isPending, setIsPending] = useState(false);

    const form = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: initialData?.name || "",
            email: initialData?.email || "",
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({ name: initialData.name, email: initialData.email });
        }
    }, [initialData, form]);

    async function onSubmit(data: ProfileValues) {
        setIsPending(true);
        try {
            const result = await updateProfileSettings(data);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsPending(false);
        }
    }

    if (!initialData) return <div>Loading profile...</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Profile</CardTitle>
                <CardDescription>Manage your personal information and contact details.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 p-4 bg-muted/30 rounded-lg border">
                    <Avatar>
                        <AvatarFallback>
                            {initialData.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{initialData.name || "User"}</h3>
                        <p className="text-sm text-muted-foreground">{initialData.email}</p>
                        <Button variant="outline" size="sm" disabled className="mt-2">
                            Change Avatar
                        </Button>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your full name" {...field} />
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
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="your.email@example.com" {...field} disabled />
                                        </FormControl>
                                        <FormDescription>
                                            Contact support to change your email.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isPending} className="w-full md:w-auto">
                                {isPending ? "Saving..." : "Save Profile"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
