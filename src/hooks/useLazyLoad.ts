import { useState, useCallback, useMemo, useEffect } from 'react'

interface UseLazyLoadProps<T> {
  items: T[]
  initialCount?: number
  loadMoreCount?: number
}

interface UseLazyLoadReturn<T> {
  visibleItems: T[]
  hasMore: boolean
  loadMore: () => void
  isLoading: boolean
  totalCount: number
  visibleCount: number
  reset: () => void
}

export function useLazyLoad<T>({
  items,
  initialCount = 24,
  loadMoreCount = 24
}: UseLazyLoadProps<T>): UseLazyLoadReturn<T> {
  const [visibleCount, setVisibleCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)

  const visibleItems = useMemo(() => {
    return items.slice(0, visibleCount)
  }, [items, visibleCount])

  const hasMore = useMemo(() => {
    return visibleCount < items.length
  }, [visibleCount, items.length])

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + loadMoreCount, items.length))
      setIsLoading(false)
    }, 300)
  }, [isLoading, hasMore, loadMoreCount, items.length])

  const reset = useCallback(() => {
    setVisibleCount(initialCount)
    setIsLoading(false)
  }, [initialCount])

  // Items değiştiğinde otomatik reset
  useEffect(() => {
    setVisibleCount(initialCount)
    setIsLoading(false)
  }, [items, initialCount])

  return {
    visibleItems,
    hasMore,
    loadMore,
    isLoading,
    totalCount: items.length,
    visibleCount,
    reset
  }
}
