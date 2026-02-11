"use client";

import { StaffTable } from "./components/staff-table";

export default function StaffPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Staff Management</h2>
                    <p className="text-muted-foreground">Manage your team members and roles.</p>
                </div>
            </div>
            <StaffTable />
        </div>
    );
}
