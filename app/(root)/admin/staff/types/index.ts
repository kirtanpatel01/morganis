export type StaffRole = 'manager' | 'cashier' | 'kitchen' | 'driver';
export type StaffStatus = 'active' | 'inactive' | 'leave';

export interface Staff {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: StaffRole;
    status: StaffStatus;
    joinDate: string;
    avatarUrl?: string;
}

export interface StaffFilters {
    search?: string;
    role?: StaffRole | 'all';
    status?: StaffStatus | 'all';
}
