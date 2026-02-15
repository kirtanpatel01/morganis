import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Order } from "../types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface OrderDetailsProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function OrderDetails({ order, open, onOpenChange }: OrderDetailsProps) {
    if (!order) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Order {order.id}</SheetTitle>
                    <SheetDescription>
                        Placed on {format(new Date(order.createdAt), "PPP p")}
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Status & Payment */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground mr-2">Status:</span>
                            <Badge variant="outline">{order.status}</Badge>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground mr-2">Payment:</span>
                            <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                                {order.paymentStatus}
                            </Badge>
                            <span className="text-sm text-muted-foreground ml-2">({order.paymentMethod})</span>
                        </div>
                    </div>

                    <Separator />

                    {/* Customer Info */}
                    <div>
                        <h3 className="font-semibold mb-2">Customer Details</h3>
                        <dl className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Name:</dt>
                                <dd>{order.customerName}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Email:</dt>
                                <dd>{order.customerEmail}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Phone:</dt>
                                <dd>{order.phoneNumber}</dd>
                            </div>
                            {order.address && (
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Address:</dt>
                                    <dd className="text-right max-w-[200px]">{order.address}</dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    <Separator />

                    {/* Order Items */}
                    <div>
                        <h3 className="font-semibold mb-2">Items</h3>
                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <div className="space-y-1">
                                        <p className="font-medium">{item.name}</p>
                                        {item.specialInstructions && (
                                            <p className="text-xs text-muted-foreground">Note: {item.specialInstructions}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p>{item.quantity} x ${item.price.toFixed(2)}</p>
                                        <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-bold">Total Amount</span>
                        <span className="text-lg font-bold">${order.totalAmount.toFixed(2)}</span>
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    );
}
