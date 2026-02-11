"use client";

import { StoreSettingsForm } from "./components/store-settings-form";
import { ProfileForm } from "./components/profile-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">Manage your store and account preferences.</p>
                </div>
            </div>

            <Tabs defaultValue="store" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="store">Store Settings</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>
                <TabsContent value="store">
                    <StoreSettingsForm />
                </TabsContent>
                <TabsContent value="profile">
                    <ProfileForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}
