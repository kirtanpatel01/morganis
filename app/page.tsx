import { PosNavbar } from "@/components/pos/pos-navbar"
import { ProductBrowser } from "@/components/pos/product-browser"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PosNavbar />
      <ProductBrowser />
    </div>
  )
}