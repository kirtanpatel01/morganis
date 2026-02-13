import { PosNavbar } from "@/components/pos/pos-navbar"
import { ProductBrowser } from "@/components/pos/product-browser"
import { getPublicProducts, getPublicCategories, getPublicStores } from "@/lib/actions/public-products"

import { CartSidebar } from "@/components/pos/cart-sidebar"

export default async function Home() {
  const products = await getPublicProducts();
  const categories = await getPublicCategories();
  const stores = await getPublicStores();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PosNavbar />
      <ProductBrowser initialProducts={products} initialCategories={categories} initialStores={stores} />
      <CartSidebar />
    </div>
  )
}