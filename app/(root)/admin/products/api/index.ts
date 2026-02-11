import { Product, Category, ProductFilters } from "../types";

// Mock Data
let MOCK_PRODUCTS: Product[] = [
  {
    id: "PROD-001",
    name: "Cheeseburger",
    description: "Juicy beef patty with cheese",
    price: 12.99,
    stock: 50,
    category: "Burgers",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "PROD-002",
    name: "Fries",
    description: "Crispy salted fries",
    price: 4.99,
    stock: 100,
    category: "Sides",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
      id: "PROD-003",
      name: "Cola",
      description: "Refreshing soda",
      price: 2.50,
      stock: 200,
      category: "Drinks",
      status: "active",
      createdAt: new Date().toISOString(),
  }
];

const MOCK_CATEGORIES: Category[] = [
  { id: "CAT-001", name: "Burgers", slug: "burgers" },
  { id: "CAT-002", name: "Sides", slug: "sides" },
  { id: "CAT-003", name: "Drinks", slug: "drinks" },
];

export const fetchProducts = async (filters?: ProductFilters): Promise<{ data: Product[], total: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let filtered = [...MOCK_PRODUCTS];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
  }
  if (filters?.category && filters.category !== "all") {
    filtered = filtered.filter(p => p.category === filters.category);
  }

  // Pagination logic can be added here
  return { data: filtered, total: filtered.length };
};

export const fetchCategories = async (): Promise<Category[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_CATEGORIES;
};

export const createProduct = async (product: Omit<Product, "id" | "createdAt">): Promise<Product> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const newProduct: Product = {
    ...product,
    id: `PROD-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  MOCK_PRODUCTS.unshift(newProduct);
  return newProduct;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
  if (index === -1) throw new Error("Product not found");
  MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...updates };
  return MOCK_PRODUCTS[index];
};

export const deleteProduct = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== id);
};
