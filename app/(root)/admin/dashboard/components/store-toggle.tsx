"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useStoreStatus, useUpdateStoreStatus } from "../hooks/use-dashboard";
import { Badge } from "@/components/ui/badge";
import { Store, Lock } from "lucide-react";

export function StoreToggle() {
    const { data: status, isLoading } = useStoreStatus();
    const { mutate: updateStatus, isPending } = useUpdateStoreStatus();

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="flex items-center space-x-4 rounded-lg border p-4 bg-card text-card-foreground shadow-sm">
            <div className="flex items-center space-x-2">
                {status?.isOpen ? <Store className="h-5 w-5 text-green-500" /> : <Lock className="h-5 w-5 text-red-500" />}
                <Label htmlFor="store-mode" className="text-base font-semibold">
                    Store Status
                </Label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch
                    id="store-mode"
                    checked={status?.isOpen}
                    onCheckedChange={(checked) => updateStatus(checked)}
                    disabled={isPending}
                />
                <Badge variant={status?.isOpen ? "default" : "destructive"}>
                    {status?.isOpen ? "Open" : "Closed"}
                </Badge>
            </div>
        </div>
    );
}
