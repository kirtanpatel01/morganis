"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import type { StoreFilters, StoreStatus } from "../_stores/types"

interface UseStoreFiltersReturn {
  filters: StoreFilters
  debouncedFilters: StoreFilters
  setSearch: (search: string) => void
  setStatus: (status: StoreStatus | "all") => void
  resetFilters: () => void
}

const DEFAULT_FILTERS: StoreFilters = {
  search: "",
  status: "all",
}

/**
 * Custom hook for managing store filters with debounced search
 */
export function useStoreFilters(): UseStoreFiltersReturn {
  const [filters, setFilters] = useState<StoreFilters>(DEFAULT_FILTERS)
  
  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebounce(filters.search || "", 300)
  
  const debouncedFilters = useMemo<StoreFilters>(
    () => ({
      ...filters,
      search: debouncedSearch,
    }),
    [filters, debouncedSearch]
  )

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }, [])

  const setStatus = useCallback((status: StoreStatus | "all") => {
    setFilters((prev) => ({ ...prev, status }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  return {
    filters,
    debouncedFilters,
    setSearch,
    setStatus,
    resetFilters,
  }
}
