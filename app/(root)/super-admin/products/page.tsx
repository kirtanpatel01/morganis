// ... imports
import { ProductsClient } from "./components/products-client"
import { getProducts, getCategories, getStoresList } from "./_products/actions"

interface SearchParams {
    [key: string]: string | string[] | undefined
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
    // We still await searchParams to satisfy Next.js page props requirements if needed, 
    // but we won't use them for *data fetching* anymore.
    await searchParams; 

    // Fetch ALL data for client-side filtering
    const [products, categories, storesList] = await Promise.all([
        getProducts({}), // Fetch all products
        getCategories(),
        getStoresList(),
    ])

    return (
        <ProductsClient 
            initialProducts={products}
            initialCategories={categories}
            initialStoresList={storesList}
        />
    )
}
