export interface Product {
  id: string;
  store_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
  } | null;
}

export interface Category {
  id: string;
  store_id: string;
  name: string;
  created_at: string;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  status?: string;
  page?: number;
  limit?: number;
}
