"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"

import type { Admin } from "../types"
import { EditAdminDialogContent } from "./edit-admin-dialog-content"
import { DeleteAdminDialogContent } from "./delete-admin-alert-dialog"

interface AdminsTableProps {
  admins: Admin[]
}

export function AdminsTable({ admins }: AdminsTableProps) {
  if (admins.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/10">
        <p className="text-muted-foreground">No admins found</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Shop Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell className="font-medium">{admin.name}</TableCell>
              <TableCell>{admin.store_name}</TableCell>
              <TableCell className="font-mono text-sm">{admin.email}</TableCell>
              <TableCell>
                <Dialog>
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <DialogTrigger asChild>
                            <span className="w-full flex items-center gap-2 cursor-pointer">
                              <Pencil className="h-4 w-4" />
                              Edit
                            </span>
                          </DialogTrigger>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem variant="destructive">
                          <AlertDialogTrigger asChild>
                            <span className="w-full flex items-center gap-2 cursor-pointer">
                              <Trash className="h-4 w-4" />
                              Delete
                            </span>
                          </AlertDialogTrigger>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <EditAdminDialogContent admin={admin} />
                    <DeleteAdminDialogContent adminId={admin.id} adminName={admin.name} />
                  </AlertDialog>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
