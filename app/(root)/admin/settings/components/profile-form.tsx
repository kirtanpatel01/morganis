"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileValues } from "./settings-schemas";
import { useUserProfile, useUpdateUserProfile } from "../hooks/use-settings";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileForm() {
    const { data: profile, isLoading } = useUserProfile();
    const { mutate: updateProfile, isPending } = useUpdateUserProfile();

    const form = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    });

    useEffect(() => {
        if (profile) {
            form.reset({ name: profile.name, email: profile.email });
        }
    }, [profile, form]);

    function onSubmit(data: ProfileValues) {
        updateProfile(data, {
            onSuccess: () => toast.success("Profile updated"),
            onError: () => toast.error("Failed to update profile"),
        });
    }

    if (isLoading) return <div>Loading profile...</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={profile?.avatarUrl} alt={profile?.name} />
                        <AvatarFallback>{profile?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Profile"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
