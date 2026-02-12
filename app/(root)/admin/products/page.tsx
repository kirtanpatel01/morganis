import { ProductsClient } from "./components/products-client";
import { getProducts, getCategories, getStoreStatus } from "./actions";

export default async function ProductsPage() {
  const products = await getProducts(); // Default filters (page 1, etc.)
  const categories = await getCategories();
  const store = await getStoreStatus();

  return (
    <ProductsClient 
      initialProducts={products}
      initialCategories={categories}
      initialStoreStatus={store?.status || 'pending'}
      storeId={store?.id}
    />
  );
}
