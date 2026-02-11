"use client"

import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteStore } from "../actions"

export function DeleteStoreDialogContent({ storeId, storeName }: { storeId: string, storeName: string }) {
    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this store?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the store
                    <span className="font-semibold tracking-wide text-destructive"> "{storeName}"</span> and remove all associated data.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={() => deleteStore(storeId)}
                    variant={"destructive"}
                    className="cursor-pointer"
                >
                    Delete Store
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}
