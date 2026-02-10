"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import type { PaginationState, PaginationControls } from "../types"

interface PaginationProps extends PaginationState, PaginationControls {
    className?: string
}

export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    goToPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
    className = "",
}: PaginationProps) {
    // Don't show pagination if there's only one page
    if (totalPages <= 1) {
        return null
    }

    const startItem = (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, totalItems)

    return (
        <div className={`flex items-center justify-between ${className}`}>
            {/* Info */}
            <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{startItem}</span> to{" "}
                <span className="font-medium">{endItem}</span> of{" "}
                <span className="font-medium">{totalItems}</span> store{totalItems !== 1 ? "s" : ""}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(1)}
                    disabled={!canGoPrev}
                    className="h-8 w-8"
                    aria-label="Go to first page"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={prevPage}
                    disabled={!canGoPrev}
                    className="h-8 w-8"
                    aria-label="Go to previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1 text-sm">
                    <span className="text-muted-foreground">Page</span>
                    <span className="font-medium">{currentPage}</span>
                    <span className="text-muted-foreground">of</span>
                    <span className="font-medium">{totalPages}</span>
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={nextPage}
                    disabled={!canGoNext}
                    className="h-8 w-8"
                    aria-label="Go to next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(totalPages)}
                    disabled={!canGoNext}
                    className="h-8 w-8"
                    aria-label="Go to last page"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
