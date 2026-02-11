export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'draft' | 'archived';
  imageUrl?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}
