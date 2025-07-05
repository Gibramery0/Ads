import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Sayfa numaralarını oluştur
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      // Toplam sayfa sayısı az ise hepsini göster
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Çok sayfa varsa akıllı bir şekilde göster
      if (currentPage <= 3) {
        // Başlangıçtayız
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push(null) // Boşluk için null
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Sondayız
        pages.push(1)
        pages.push(null) // Boşluk için null
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Ortadayız
        pages.push(1)
        pages.push(null) // Boşluk için null
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push(null) // Boşluk için null
        pages.push(totalPages)
      }
    }
    
    return pages
  }
  
  const pageNumbers = getPageNumbers()
  
  return (
    <div className="flex items-center gap-1">
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {pageNumbers.map((page, index) => 
        page === null ? (
          <span key={`ellipsis-${index}`} className="px-2">...</span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page as number)}
            className="min-w-[2.5rem]"
          >
            {page}
          </Button>
        )
      )}
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}