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
    DialogTrigger,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { createStoreSchema, type CreateStoreInput } from "../schemas"
import { toast } from "sonner"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { Eye, EyeOff, Copy, Check } from "lucide-react"

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
    { code: "26", name: "Dadra and Nagar Haveli and Daman and Diu" },
    { code: "27", name: "Maharashtra" },
    { code: "29", name: "Karnataka" },
    { code: "30", name: "Goa" },
    { code: "31", name: "Lakshadweep" },
    { code: "32", name: "Kerala" },
    { code: "33", name: "Tamil Nadu" },
    { code: "34", name: "Puducherry" },
    { code: "35", name: "Andaman and Nicobar Islands" },
    { code: "36", name: "Telangana" },
    { code: "37", name: "Andhra Pradesh" },
    { code: "38", name: "Ladakh" },
    { code: "97", name: "Other Territory" },
]
import { createStore } from "../actions"

export function CreateStoreModal() {
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [createdCredentials, setCreatedCredentials] = useState<CreateStoreInput | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (!createdCredentials) return;
        const text = `Email: ${createdCredentials.adminEmail}\nPassword: ${createdCredentials.adminPassword}`;
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        toast.success("Credentials copied!");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleClose = () => {
        setOpen(false);
        setCreatedCredentials(null);
        form.reset();
    };

    const form = useForm<CreateStoreInput>({
        resolver: zodResolver(createStoreSchema),
        shouldUnregister: true,
        defaultValues: {
            name: "",
            ownerName: "",
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
            setCreatedCredentials(data)
        } else {
            toast.error(result?.message ?? "Failed to create store")
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) handleClose();
            else setOpen(true);
        }}>
            <DialogTrigger asChild>
                <Button>Create New Store</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Store & Admin</DialogTitle>
                    <DialogDescription>
                        Enter store details and admin credentials.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    {createdCredentials ? (
                        <div className="space-y-6">
                            <div className="p-4 bg-muted/50 rounded-lg border border-border relative">
                                <h3 className="font-semibold mb-2 text-sm text-foreground">Created Credentials</h3>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <p><span className="font-medium text-foreground">Store:</span> {createdCredentials.name}</p>
                                    <p><span className="font-medium text-foreground">Owner:</span> {createdCredentials.ownerName}</p>
                                    <p><span className="font-medium text-foreground">Email:</span> {createdCredentials.adminEmail}</p>
                                    <p><span className="font-medium text-foreground">Password:</span> {createdCredentials.adminPassword}</p>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-2 right-2 h-8 w-8 cursor-pointer"
                                    onClick={handleCopy}
                                >
                                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                    <span className="sr-only">Copy credentials</span>
                                </Button>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleClose}>Close</Button>
                            </DialogFooter>
                        </div>
                    ) : (
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
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
                                name="ownerName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Owner Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
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

                            <FormField
                                control={form.control}
                                name="stateCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State Code *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a state" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-[200px]">
                                                {INDIAN_STATES.map((state) => (
                                                    <SelectItem key={state.code} value={state.code}>
                                                        {state.name} ({state.code})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                            <Input type="email" {...field} placeholder="example@mail.com" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="adminPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Admin Password *</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    {...field}
                                                    placeholder="Abcd1234"
                                                    className="pr-10"
                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                                )}
                                                <span className="sr-only">
                                                    {showPassword ? "Hide password" : "Show password"}
                                                </span>
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="button" variant={"outline"} onClick={() => form.reset()}>Reset</Button>

                                <Button type="submit" disabled={form.formState.isSubmitting} >
                                    {form.formState.isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <Spinner />
                                            Creating Store...
                                        </span>
                                    ) : (
                                        "Create Store"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    )
}
