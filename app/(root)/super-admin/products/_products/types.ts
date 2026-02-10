// Types for Super Admin Products Page

export interface Category {
  id: string
  name: string
  description?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  categoryName: string
  storeId: string
  storeName: string
  imageUrl?: string
  isAvailable: boolean
  createdAt: string
}

export interface StoreMenu {
  storeId: string
  storeName: string
  categories: Category[]
  products: Product[]
  totalProducts: number
}

export interface ProductFilters {
  storeId?: string
  categoryId?: string
  search?: string
  availability?: "all" | "available" | "unavailable"
}
