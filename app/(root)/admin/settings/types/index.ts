export interface StoreSettings {
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    currency: string;
    taxRate: number;
    logoUrl?: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'staff' | 'super_admin';
    avatarUrl?: string;
}
