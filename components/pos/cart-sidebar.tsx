"use client"

import { IconMinus, IconPlus, IconShoppingCart, IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCartStore } from "./cart-store"
import { useEffect, useState } from "react"

export function CartSidebar() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal, clearCart } = useCartStore()
  // Hydration fix for persist middleware
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const cartSubtotal = subtotal()
  const cartTax = items.reduce((acc, item) => {
      const rate = item.taxRate || 0;
      return acc + (item.price * item.quantity * rate / 100);
  }, 0);
  const cartTotal = cartSubtotal + cartTax;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:w-[450px] flex flex-col p-0 gap-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <IconShoppingCart className="h-5 w-5" />
            Current Order
          </SheetTitle>
          <SheetDescription>
            {items.reduce((acc, item) => acc + item.quantity, 0)} items selected
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 p-4">
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4 text-muted-foreground opacity-50">
                    <IconShoppingCart className="h-16 w-16 stroke-1" />
                    <p>Your cart is empty.</p>
                </div>
            ) : (
                items.map((item) => (
                <div key={item.id} className="flex gap-4">

                    
                    <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                            <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                            <p className="font-semibold text-sm shrink-0">
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                             <div className="text-xs text-muted-foreground">
                                ${item.price} / {item.unit}
                                {item.unit_quantity && Number(item.unit_quantity) > 1 && ` (${item.unit_quantity} pcs)`}
                                {item.taxRate && item.taxRate > 0 && <span className="ml-1 text-xs text-muted-foreground">(Tax: {item.taxRate}%)</span>}
                             </div>
                             
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-6 w-6 rounded-full"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                    <IconMinus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm w-4 text-center">{item.quantity}</span>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-6 w-6 rounded-full"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                    <IconPlus className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                ))
            )}
          </div>
        </ScrollArea>

        {items.length > 0 && (
            <div className="border-t bg-muted/20 p-4 space-y-4">
                <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                        <span>${cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span>${cartTax.toFixed(2)}</span>
                    </div>
                     <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={clearCart}>
                         Clear
                    </Button>
                    <Button className="w-full">
                        Checkout
                    </Button>
                </div>
            </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
