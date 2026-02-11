// "use client"

// import { useState, useEffect, useCallback, useMemo } from "react"
// import { getStores } from "../_stores/actions"
// import type { Store, StoreFilters, PaginationState, PaginationControls } from "../_stores/types"

// interface UseStoresOptions {
//   filters?: StoreFilters
//   pageSize?: number
//   initialPage?: number
// }

// interface UseStoresReturn {
//   stores: Store[]
//   loading: boolean
//   error: Error | null
//   pagination: PaginationState & PaginationControls
//   refetch: () => Promise<void>
// }

// /**
//  * Custom hook for fetching and managing stores with pagination
//  */
// export function useStores(options: UseStoresOptions = {}): UseStoresReturn {
//   const { filters = {}, pageSize = 10, initialPage = 1 } = options

//   const [allStores, setAllStores] = useState<Store[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<Error | null>(null)
//   const [currentPage, setCurrentPage] = useState(initialPage)

//   // Fetch stores from server
//   const fetchStores = useCallback(async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const data = await getStores(filters)
//       setAllStores(data)
//       // Reset to first page when filters change
//       setCurrentPage(1)
//     } catch (err) {
//       setError(err instanceof Error ? err : new Error("Failed to fetch stores"))
//       setAllStores([])
//     } finally {
//       setLoading(false)
//     }
//   }, [filters])

//   // Fetch on mount and when filters change
//   useEffect(() => {
//     fetchStores()
//   }, [fetchStores])

//   // Calculate pagination
//   const paginationState = useMemo<PaginationState>(() => {
//     const totalItems = allStores.length
//     const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    
//     return {
//       currentPage: Math.min(currentPage, totalPages), // Ensure current page is valid
//       totalPages,
//       totalItems,
//       pageSize,
//     }
//   }, [allStores.length, pageSize, currentPage])

//   // Get current page data
//   const paginatedStores = useMemo(() => {
//     const startIndex = (paginationState.currentPage - 1) * pageSize
//     const endIndex = startIndex + pageSize
//     return allStores.slice(startIndex, endIndex)
//   }, [allStores, paginationState.currentPage, pageSize])

//   // Pagination controls
//   const paginationControls = useMemo<PaginationControls>(() => {
//     const canGoPrev = paginationState.currentPage > 1
//     const canGoNext = paginationState.currentPage < paginationState.totalPages

//     return {
//       goToPage: (page: number) => {
//         const validPage = Math.max(1, Math.min(page, paginationState.totalPages))
//         setCurrentPage(validPage)
//       },
//       nextPage: () => {
//         if (canGoNext) {
//           setCurrentPage((prev) => prev + 1)
//         }
//       },
//       prevPage: () => {
//         if (canGoPrev) {
//           setCurrentPage((prev) => prev - 1)
//         }
//       },
//       canGoNext,
//       canGoPrev,
//     }
//   }, [paginationState.currentPage, paginationState.totalPages])

//   return {
//     stores: paginatedStores,
//     loading,
//     error,
//     pagination: {
//       ...paginationState,
//       ...paginationControls,
//     },
//     refetch: fetchStores,
//   }
// }
