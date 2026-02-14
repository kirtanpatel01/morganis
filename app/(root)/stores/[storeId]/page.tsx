import { notFound } from "next/navigation";
import { getStoreProducts, getStoreCategories, getStoreDetails } from "@/lib/actions/public-products";
import { StoreProductBrowser } from "./_components/store-product-browser";
import { PosNavbar } from "@/components/pos/pos-navbar";
import { CartSidebar } from "@/components/pos/cart-sidebar";

interface PageProps {
  params: Promise<{
    storeId: string;
  }>;
}

export default async function StorePage({ params }: PageProps) {
  const { storeId } = await params;

  // Parallel data fetching
  const [products, categories, storeDetails] = await Promise.all([
    getStoreProducts(storeId),
    getStoreCategories(storeId),
    getStoreDetails(storeId)
  ]);

  if (!storeDetails) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PosNavbar />
      <StoreProductBrowser 
        storeId={storeId}
        storeDetails={storeDetails}
        initialProducts={products}
        initialCategories={categories}
      />
      <CartSidebar storeId={storeId} />
    </div>
  );
}
