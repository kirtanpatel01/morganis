"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "./product-schema";
import { IconInfoCircle } from "@tabler/icons-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories, useCreateProduct, useUpdateProduct } from "../hooks/use-products";
import { toast } from "sonner";
import { Product } from "../types";
import { useEffect } from "react";
import { DialogFooter } from "@/components/ui/dialog";

interface ProductFormProps {
    initialData?: Product;
    onSuccess?: () => void;
    taxRate: number;
}

export function ProductForm({ initialData, onSuccess, taxRate }: ProductFormProps) {
    const { data: categories } = useCategories();
    const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any, // Cast to any to resolve strictly typed resolver mismatch with default values
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            price: initialData?.price || 0,
            stock: initialData?.stock || 0,
            unit: initialData?.unit || "pcs",
            unit_quantity: initialData?.unit_quantity || 1,
            category_id: initialData?.category_id || "",
            status: initialData?.status || "active",
        },
    });

    // Reset form when initialData changes (for edit mode)
    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                description: initialData.description || "",
                price: initialData?.price || 0.00,
                stock: initialData?.stock || 0,
                unit: initialData?.unit || "pcs",
                unit_quantity: initialData?.unit_quantity || 1,
                category_id: initialData?.category_id || "",
                status: initialData?.status || "active",
            });
        } else {
             form.reset({
                name: "",
                description: "",
                price: 0.00,
                stock: 0,
                unit: "pcs",
                unit_quantity: 1,
                category_id: "",
                status: "active",
            });
        }
    }, [initialData, form]);


    const onSubmit = (values: ProductFormValues) => {
        if (initialData) {
            updateProduct(
                { id: initialData.id, updates: values },
                {
                    onSuccess: () => {
                        toast.success("Product updated successfully");
                        onSuccess?.();
                    },
                    onError: () => toast.error("Failed to update product"),
                }
            );
        } else {
            createProduct(values, {
                onSuccess: () => {
                    toast.success("Product created successfully");
                    form.reset();
                    onSuccess?.();
                },
                onError: () => toast.error("Failed to create product"),
            });
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input placeholder="Product Name" {...field} />
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
                            <FormLabel>Description <span className="text-muted-foreground text-xs font-normal ml-1">(Optional)</span></FormLabel>
                            <FormControl>
                                <Textarea placeholder="Product Description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category <span className="text-destructive">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories?.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
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
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status <span className="text-destructive">*</span></FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <span>Price <span className="text-destructive">*</span></span>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger type="button">
                                                <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>The selling price for one unit of the product.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        value={field.value}
                                    />
                                </FormControl>
                                {taxRate > 0 && (
                                    <FormDescription className="mt-1 font-medium bg-muted p-2 rounded">
                                        Total Price (Inc. {taxRate}% Tax): <span className="text-secondary-foreground font-semibold">₹{(((parseFloat(field.value?.toString() || "0") || 0) * (1 + taxRate / 100))).toFixed(2)}</span>
                                    </FormDescription>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <span>Unit <span className="text-destructive">*</span></span>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger type="button">
                                                <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>The unit of measurement (e.g., kg, pcs, plate).</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. pcs, kg, liter" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="unit_quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <span>Quantity per Unit <span className="text-muted-foreground text-xs font-normal ml-1">(Optional)</span></span>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger type="button">
                                                <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Number of items in one unit (e.g., 6 pcs per plate).</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number" 
                                        min="1"
                                        placeholder="1 (Default)" 
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        value={isNaN(field.value) ? '' : field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <span>Stock <span className="text-destructive">*</span></span>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger type="button">
                                                <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Total number of units available in inventory.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <DialogFooter className="pt-4">
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
