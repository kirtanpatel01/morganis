"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeSettingsSchema, StoreSettingsValues } from "./settings-schemas";
import { updateStoreSettings } from "../actions";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Using textarea for address
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const INDIAN_STATES = [
    { code: "01", name: "Jammu and Kashmir" },
    { code: "02", name: "Himachal Pradesh" },
    { code: "03", name: "Punjab" },
    { code: "04", name: "Chandigarh" },
    { code: "05", name: "Uttarakhand" },
    { code: "06", name: "Haryana" },
    { code: "07", name: "Delhi" },
    { code: "08", name: "Rajasthan" },
    { code: "09", name: "Uttar Pradesh" },
    { code: "10", name: "Bihar" },
    { code: "11", name: "Sikkim" },
    { code: "12", name: "Arunachal Pradesh" },
    { code: "13", name: "Nagaland" },
    { code: "14", name: "Manipur" },
    { code: "15", name: "Mizoram" },
    { code: "16", name: "Tripura" },
    { code: "17", name: "Meghalaya" },
    { code: "18", name: "Assam" },
    { code: "19", name: "West Bengal" },
    { code: "20", name: "Jharkhand" },
    { code: "21", name: "Odisha" },
    { code: "22", name: "Chhattisgarh" },
    { code: "23", name: "Madhya Pradesh" },
    { code: "24", name: "Gujarat" },
    { code: "25", name: "Daman and Diu" },
    { code: "26", name: "Dadra and Nagar Haveli" },
    { code: "27", name: "Maharashtra" },
    { code: "28", name: "Andhra Pradesh (Old)" },
    { code: "29", name: "Karnataka" },
    { code: "30", name: "Goa" },
    { code: "31", name: "Lakshadweep" },
    { code: "32", name: "Kerala" },
    { code: "33", name: "Tamil Nadu" },
    { code: "34", name: "Puducherry" },
    { code: "35", name: "Andaman and Nicobar Islands" },
    { code: "36", name: "Telangana" },
    { code: "37", name: "Andhra Pradesh (New)" },
];

export function StoreSettingsForm({ initialData }: { initialData: StoreSettingsValues & { status?: string } | null }) {
    const [isPending, setIsPending] = useState(false);

    const form = useForm<StoreSettingsValues>({
        resolver: zodResolver(storeSettingsSchema) as any,
        defaultValues: {
            name: initialData?.name || "",
            // Provide default if null?
            gstin: initialData?.gstin || "",
            address: initialData?.address || "",
            stateCode: initialData?.stateCode || "",
            taxRate: initialData?.taxRate || 0,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({ 
                name: initialData.name, 
                gstin: initialData.gstin,
                address: initialData.address,
                stateCode: initialData.stateCode,
                taxRate: initialData.taxRate
            });
        }
    }, [initialData, form]);

    async function onSubmit(data: StoreSettingsValues) {
        setIsPending(true);
        try {
            const result = await updateStoreSettings(data);
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

    if (!initialData) return <div>Loading settings...</div>;

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "active": return "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20";
            case "inactive": return "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20";
            case "pending": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20";
            default: return "bg-gray-500/10 text-gray-500";
        }
    };

    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div className="space-y-1">
                    <CardTitle className="text-2xl">Store Information</CardTitle>
                    <CardDescription>
                        Update your store&apos;s public details.
                    </CardDescription>
                </div>
                {initialData.status && (
                    <Badge variant="outline" className={`capitalize ${getStatusColor(initialData.status)}`}>
                        {initialData.status}
                    </Badge>
                )}
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Store Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your store name" {...field} />
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
                                        <FormLabel>GSTIN</FormLabel>
                                        <FormControl>
                                            <Input placeholder="GST Number (15 chars)" {...field} maxLength={15} />
                                        </FormControl>
                                        <FormDescription>Must be exactly 15 characters.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="stateCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a state" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="h-[200px]" align="end">
                                                {INDIAN_STATES.map((state) => (
                                                    <SelectItem key={state.code} value={state.code}>
                                                        {state.code} - {state.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                                step="0.01" 
                                                placeholder="0.00" 
                                                {...field}
                                                onChange={e => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormDescription>Applicable tax rate for all products.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Store Address</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Enter full store address" 
                                                className="min-h-[100px] resize-none" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isPending} className="w-full md:w-auto">
                                {isPending ? "Saving changes..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
