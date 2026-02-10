"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { createStore, updateStore, deleteStore, toggleStoreStatus } from "../_stores/actions"
import type { CreateStoreInput, UpdateStoreInput, ActionResult } from "../_stores/types"

interface UseStoreMutationsOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}

interface UseStoreMutationsReturn {
  createStore: (data: CreateStoreInput) => Promise<ActionResult>
  updateStore: (data: UpdateStoreInput) => Promise<ActionResult>
  deleteStore: (id: string) => Promise<ActionResult>
  toggleStatus: (id: string) => Promise<ActionResult>
  isLoading: boolean
}

/**
 * Custom hook for store mutations (create, update, delete, toggle status)
 */
export function useStoreMutations(options: UseStoreMutationsOptions = {}): UseStoreMutationsReturn {
  const { onSuccess, onError } = options
  const [isLoading, setIsLoading] = useState(false)

  const handleMutation = useCallback(
    async <T,>(
      mutationFn: () => Promise<ActionResult<T>>,
      successMessage?: string
    ): Promise<ActionResult<T>> => {
      setIsLoading(true)
      try {
        const result = await mutationFn()
        
        if (result.success) {
          if (successMessage || result.message) {
            toast.success(successMessage || result.message)
          }
          await onSuccess?.()
        } else {
          toast.error(result.message || "Operation failed")
          onError?.(new Error(result.message))
        }
        
        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
        toast.error(errorMessage)
        onError?.(error instanceof Error ? error : new Error(errorMessage))
        return {
          success: false,
          message: errorMessage,
        }
      } finally {
        setIsLoading(false)
      }
    },
    [onSuccess, onError]
  )

  return {
    createStore: useCallback(
      (data: CreateStoreInput) => handleMutation(() => createStore(data)),
      [handleMutation]
    ),
    
    updateStore: useCallback(
      (data: UpdateStoreInput) => handleMutation(() => updateStore(data)),
      [handleMutation]
    ),
    
    deleteStore: useCallback(
      (id: string) => handleMutation(() => deleteStore(id)),
      [handleMutation]
    ),
    
    toggleStatus: useCallback(
      (id: string) => handleMutation(() => toggleStoreStatus(id)),
      [handleMutation]
    ),
    
    isLoading,
  }
}
