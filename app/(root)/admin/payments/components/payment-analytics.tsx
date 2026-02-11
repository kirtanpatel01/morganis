import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePaymentStats } from "../hooks/use-payments";
import { DollarSign, CreditCard, RefreshCcw, Clock } from "lucide-react";

export function PaymentAnalytics() {
    const { data: stats, isLoading } = usePaymentStats();

    if (isLoading) {
        return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <Card key={i}><CardContent className="h-24 animate-pulse bg-muted/50" /></Card>
            ))}
        </div>
    }

    if (!stats) return null;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Daily Revenue (Avg)</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.dailyRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Based on last 30 days</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.pendingPayments.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Awating settlement</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Refunded</CardTitle>
                    <RefreshCcw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.refundedAmount.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Total refunded</p>
                </CardContent>
            </Card>
        </div>
    );
}
