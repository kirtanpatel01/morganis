"use server"

import { PRODUCTS, CATEGORIES, STORES_LIST } from "./constants"
import type { Product, Category, StoreMenu, ProductFilters } from "./types"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Get all stores for dropdown
 */
export async function getStoresList(): Promise<{ id: string; name: string }[]> {
  await delay(50)
  return STORES_LIST
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  await delay(50)
  return CATEGORIES
}

/**
 * Get products with filters
 */
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  await delay(100)
  
  let result = [...PRODUCTS]
  
  if (filters?.storeId && filters.storeId !== "all") {
    result = result.filter((product) => product.storeId === filters.storeId)
  }
  
  if (filters?.categoryId && filters.categoryId !== "all") {
    result = result.filter((product) => product.categoryId === filters.categoryId)
  }
  
  if (filters?.search) {
    const search = filters.search.toLowerCase()
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.categoryName.toLowerCase().includes(search)
    )
  }
  
  if (filters?.availability && filters.availability !== "all") {
    const isAvailable = filters.availability === "available"
    result = result.filter((product) => product.isAvailable === isAvailable)
  }
  
  return result
}

/**
 * Get store menu with all products and categories
 */
export async function getStoreMenu(storeId: string): Promise<StoreMenu | null> {
  await delay(100)
  
  const store = STORES_LIST.find((s) => s.id === storeId)
  if (!store) {
    return null
  }
  
  const storeProducts = PRODUCTS.filter((p) => p.storeId === storeId)
  const categoryIds = [...new Set(storeProducts.map((p) => p.categoryId))]
  const storeCategories = CATEGORIES.filter((c) => categoryIds.includes(c.id))
  
  return {
    storeId: store.id,
    storeName: store.name,
    categories: storeCategories,
    products: storeProducts,
    totalProducts: storeProducts.length,
  }
}

/**
 * Get product counts by store
 */
export async function getProductCountsByStore(): Promise<{ storeId: string; storeName: string; count: number }[]> {
  await delay(50)
  
  return STORES_LIST.map((store) => ({
    storeId: store.id,
    storeName: store.name,
    count: PRODUCTS.filter((p) => p.storeId === store.id).length,
  }))
}

/**
 * Get all store menus overview
 */
export async function getAllStoreMenus(): Promise<StoreMenu[]> {
  await delay(150)
  
  return STORES_LIST.map((store) => {
    const storeProducts = PRODUCTS.filter((p) => p.storeId === store.id)
    const categoryIds = [...new Set(storeProducts.map((p) => p.categoryId))]
    const storeCategories = CATEGORIES.filter((c) => categoryIds.includes(c.id))
    
    return {
      storeId: store.id,
      storeName: store.name,
      categories: storeCategories,
      products: storeProducts,
      totalProducts: storeProducts.length,
    }
  })
}
