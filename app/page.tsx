import { PosNavbar } from "@/components/pos/pos-navbar";
import { CartSidebar } from "@/components/pos/cart-sidebar";
import { getActiveStores } from "./(root)/stores/actions";
import { StoresGrid } from "./(root)/stores/[storeId]/_components/stores-grid";

export default async function Home() {
  const stores = await getActiveStores();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PosNavbar />
      <StoresGrid initialData={stores} />
      <CartSidebar />
    </div>
  );
}