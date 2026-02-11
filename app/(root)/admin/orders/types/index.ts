export type OrderStatus = 'pending' | 'accepted' | 'completed' | 'paid_and_completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'online' | 'card';

export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    specialInstructions?: string;
}

export interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    phoneNumber: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentStatus: 'paid' | 'unpaid';
    createdAt: string;
    address?: string;
}

export interface OrderFilters {
    search?: string;
    status?: OrderStatus | 'all';
    paymentMethod?: PaymentMethod | 'all';
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
}
