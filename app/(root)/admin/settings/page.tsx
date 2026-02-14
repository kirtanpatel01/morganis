import { StoreSettingsForm } from "./components/store-settings-form";
import { ProfileForm } from "./components/profile-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStoreSettings, getProfileSettings } from "./actions";

import { Store, User } from "lucide-react";

export default async function SettingsPage() {
    const storeSettings = await getStoreSettings();
    const profileSettings = await getProfileSettings();

    return (
        <div className="flex-1 space-y-4 p-6">
            <div className="max-w-5xl">
                <Tabs defaultValue="store">
                    <TabsList>
                        <TabsTrigger value="store">
                            <Store className="h-4 w-4" />
                            Store Settings
                        </TabsTrigger>
                        <TabsTrigger value="profile">
                            <User className="h-4 w-4" />
                            My Profile
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="store">
                        <StoreSettingsForm initialData={storeSettings} />
                    </TabsContent>
                    
                    <TabsContent value="profile">
                        <ProfileForm initialData={profileSettings} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
