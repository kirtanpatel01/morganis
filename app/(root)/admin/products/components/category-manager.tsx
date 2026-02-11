"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash2, Plus } from "lucide-react";
import { useCategories } from "../hooks/use-products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // Assuming sonner

// Mock Category Mutations (should be moved to api/hooks)
// For now, I'll just simulate them here as they were not explicitly in the previous API file
// but required for the feature.
const createCategory = async (name: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would return the new category
    return { id: `CAT-${Date.now()}`, name, slug: name.toLowerCase().replace(/ /g, '-') };
}
const deleteCategory = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
}

export function CategoryManager() {
    const [newVal, setNewVal] = useState("");
    const { data: categories } = useCategories();
    const queryClient = useQueryClient();

    // Quick hooks for this component (ideally move to hooks/use-products.ts)
    const { mutate: addCat, isPending: isAdding } = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            toast.success("Category added (mock)");
            setNewVal("");
            queryClient.invalidateQueries({ queryKey: ["products", "categories"] });
        }
    });

    const { mutate: delCat, isPending: isDeleting } = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            toast.success("Category deleted (mock)");
            queryClient.invalidateQueries({ queryKey: ["products", "categories"] });
        }
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Input
                    placeholder="New Category Name"
                    value={newVal}
                    onChange={(e) => setNewVal(e.target.value)}
                />
                <Button onClick={() => addCat(newVal)} disabled={!newVal || isAdding}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories?.map((cat) => (
                            <TableRow key={cat.id}>
                                <TableCell className="font-medium">{cat.name}</TableCell>
                                <TableCell>{cat.slug}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => delCat(cat.id)}
                                        disabled={isDeleting}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {categories?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">No categories found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
