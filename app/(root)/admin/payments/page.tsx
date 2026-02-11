"use client";

import { PaymentAnalytics } from "./components/payment-analytics";
import { PaymentHistory } from "./components/payment-history";
import { Separator } from "@/components/ui/separator";

export default function PaymentsPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
                    <p className="text-muted-foreground">Monitor revenue and payment transactions.</p>
                </div>
            </div>

            <PaymentAnalytics />

            <Separator className="my-4" />

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Transaction History</h3>
                <PaymentHistory />
            </div>
        </div>
    );
}
