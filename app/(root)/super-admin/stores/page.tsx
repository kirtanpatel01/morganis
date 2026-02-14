import { Suspense } from "react"
// other imports
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

import {
    StoresTable,
    CreateStoreModal,
    StoreFilters
} from "./_stores/components"
import { getStores } from "./_stores/actions"

export default async function StoresPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams;
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
    const status = typeof searchParams.status === 'string' ? searchParams.status : undefined

    const stores = await getStores({ search, status });
    // console.log(stores)

    return (
        <div className="flex flex-1 flex-col gap-6 p-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Store Management</CardTitle>
                    <CreateStoreModal />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Suspense fallback={<div>Loading filters...</div>}>
                        <StoreFilters />
                    </Suspense>
                    <StoresTable stores={stores} />
                </CardContent>
            </Card>
        </div>
    )
}