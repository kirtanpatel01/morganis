"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, Plus } from "lucide-react";
import { useStaff, useDeleteStaff } from "../hooks/use-staff";
import { Staff } from "../types";
import { format } from "date-fns";
import { toast } from "sonner";
import { StaffModal } from "./staff-modal";

export function StaffTable() {
    const [search, setSearch] = useState("");
    const { data: staffData, isLoading } = useStaff({ search });
    const { mutate: deleteStaff } = useDeleteStaff();

    const [selectedStaff, setSelectedStaff] = useState<Staff | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEdit = (staff: Staff) => {
        setSelectedStaff(staff);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedStaff(undefined);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this staff member?")) {
            deleteStaff(id, {
                onSuccess: () => toast.success("Staff deleted"),
                onError: () => toast.error("Failed to delete staff"),
            });
        }
    };

    if (isLoading) return <div>Loading staff...</div>;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search staff..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 w-[250px]"
                        />
                    </div>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Staff
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staffData?.map((staff) => (
                            <TableRow key={staff.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{staff.name}</span>
                                        <span className="text-xs text-muted-foreground">{staff.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="capitalize">{staff.role}</TableCell>
                                <TableCell>
                                    <Badge variant={staff.status === 'active' ? 'default' : (staff.status === 'inactive' ? 'secondary' : 'outline')}>
                                        {staff.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{staff.phone}</TableCell>
                                <TableCell>{format(new Date(staff.joinDate), "MMM d, yyyy")}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleEdit(staff)}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() => handleDelete(staff.id)}
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {staffData?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No staff members found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <StaffModal
                isOpen={isModalOpen}
                initialData={selectedStaff}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
