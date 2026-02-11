export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'online_wallet';

export interface Payment {
    id: string;
    orderId: string;
    customerName: string;
    amount: number;
    status: PaymentStatus;
    method: PaymentMethod;
    transactionId?: string;
    createdAt: string;
}

export interface PaymentStats {
    totalRevenue: number;
    dailyRevenue: number;
    pendingPayments: number;
    refundedAmount: number;
}

export interface PaymentFilters {
    search?: string;
    status?: PaymentStatus | 'all';
    method?: PaymentMethod | 'all';
    startDate?: Date;
    endDate?: Date;
}
