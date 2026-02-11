import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Search } from "lucide-react"

import {
    StoresTable,
    CreateStoreModal,
} from "./_stores/components"
import { useStoreFilters } from "./_hooks/use-store-filters"
import { getStores } from "./_stores/actions"

export default async function StoresPage() {
    // const { filters, setSearch, setStatus } = useStoreFilters()
    const { success, message, data: { stores } } = await getStores();
    console.log(success, message, stores)

    return (
        <div className="flex flex-1 flex-col gap-6 p-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Store Management</CardTitle>
                    <CreateStoreModal />
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Filters */}
                    {/* <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, ID, GSTIN, or email..."
                                className="pl-9"
                                value={filters.search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={filters.status} onValueChange={setStatus}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon" onClick={refetch} disabled={loading}>
                                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                            </Button>
                        </div>
                    </div> */}

                    <StoresTable stores={stores} />
                </CardContent>
            </Card>
        </div>
    )
}