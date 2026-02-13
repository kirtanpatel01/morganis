
export interface Product {
  id: string
  name: string
  category: string
  unit?: string
  unit_quantity?: number
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  inStock: boolean
  isNew?: boolean
}

export const products: Product[] = [
  {
    id: "1",
    name: "Ergonomic Office Chair",
    category: "Furniture",
    price: 299.99,
    originalPrice: 349.99,
    image: "https://placehold.co/400x400",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    isNew: true,
  },
  {
    id: "2",
    name: "Wireless Mechanical Keyboard",
    category: "Electronics",
    price: 159.99,
    image: "https://placehold.co/400x400",
    rating: 4.8,
    reviews: 86,
    inStock: true,
  },
  {
    id: "3",
    name: "4K Monitor 27-inch",
    category: "Electronics",
    price: 399.99,
    originalPrice: 449.99,
    image: "https://placehold.co/400x400",
    rating: 4.6,
    reviews: 215,
    inStock: true,
  },
  {
    id: "4",
    name: "Smart Desk Lamp",
    category: "Lighting",
    price: 49.99,
    image: "https://placehold.co/400x400",
    rating: 4.2,
    reviews: 54,
    inStock: true,
  },
  {
    id: "5",
    name: "Noise Cancelling Headphones",
    category: "Audio",
    price: 249.99,
    originalPrice: 299.99,
    image: "https://placehold.co/400x400",
    rating: 4.7,
    reviews: 342,
    inStock: true,
    isNew: true,
  },
  {
    id: "6",
    name: "USB-C Docking Station",
    category: "Accessories",
    price: 89.99,
    image: "https://placehold.co/400x400",
    rating: 4.4,
    reviews: 92,
    inStock: false,
  },
  {
    id: "7",
    name: "Minimalist Backpack",
    category: "Bags",
    price: 79.99,
    image: "https://placehold.co/400x400",
    rating: 4.9,
    reviews: 156,
    inStock: true,
  },
  {
    id: "8",
    name: "Smart Watch Series 5",
    category: "Wearables",
    price: 329.99,
    originalPrice: 379.99,
    image: "https://placehold.co/400x400",
    rating: 4.6,
    reviews: 189,
    inStock: true,
  },
]

export const categories = [
  "All",
  "Electronics",
  "Furniture",
  "Lighting",
  "Audio",
  "Accessories",
  "Bags",
  "Wearables",
]
