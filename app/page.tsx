import { PosNavbar } from "@/components/pos/pos-navbar"
import { ProductBrowser } from "@/components/pos/product-browser"
import { getPublicProducts, getPublicCategories } from "@/lib/actions/public-products"

export default async function Home() {
  const products = await getPublicProducts();
  const categories = await getPublicCategories();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PosNavbar />
      <ProductBrowser initialProducts={products} initialCategories={categories} />
    </div>
  )
}