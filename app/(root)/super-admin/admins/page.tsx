import React from 'react'
import { getAdmins } from './actions'
import { AdminsTable } from './components/admins-table'

export default async function AdminsPage() {
    const admins = await getAdmins()

    return (
        <div className="flex flex-col gap-6 p-6">
             <div className="flex items-center justify-between">
                <div>
                   <h1 className="text-3xl font-bold tracking-tight">Admins</h1>
                   <p className="text-muted-foreground">Manage your store admins here.</p>
                </div>
            </div>
            
            <AdminsTable admins={admins} />
        </div>
    )
}