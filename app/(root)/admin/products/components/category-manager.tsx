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
import { useCategories, useCreateCategory, useDeleteCategory } from "../hooks/use-products";
import { toast } from "sonner";
import { Category } from "../types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function CategoryManager({ initialData, storeStatus }: { initialData: Category[]; storeStatus?: string }) {
    const [newVal, setNewVal] = useState("");
    const { data: categories } = useCategories(initialData);

    const { mutate: addCat, isPending: isAdding } = useCreateCategory();
    const { mutate: delCat, isPending: isDeleting } = useDeleteCategory();
    const isActive = storeStatus === 'active';

    const handleAdd = () => {
        if (!newVal.trim()) {
            toast.error("Please enter a category name");
            return;
        }
        
        if (!isActive) {
             toast.error(`Store is ${storeStatus}. Cannot add category.`);
             return;
        }

        addCat(newVal, {
            onSuccess: () => {
                toast.success("Category added");
                setNewVal("");
            },
            onError: () => {
                toast.error("Failed to add category");
            }
        });
    }

    const handleDelete = (id: string) => {
        delCat(id, {
            onSuccess: () => {
                toast.success("Category deleted");
            },
            onError: () => {
                toast.error("Failed to delete category");
            }
        });
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Input
                    placeholder="New Category Name"
                    value={newVal}
                    onChange={(e) => setNewVal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && isActive && handleAdd()}
                    disabled={!isActive}
                />
                
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="inline-block"> 
                                <Button onClick={handleAdd} disabled={isAdding || !isActive}>
                                    <Plus className="h-4 w-4 mr-2" /> Add
                                </Button>
                            </div>
                        </TooltipTrigger>
                        {!isActive && (
                            <TooltipContent>
                                <p>You cannot create categories because the store status is {storeStatus}.</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories?.map((cat) => (
                            <TableRow key={cat.id}>
                                <TableCell className="font-medium">{cat.name}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(cat.id)}
                                        disabled={isDeleting || !isActive}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {categories?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center h-24">No categories found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
