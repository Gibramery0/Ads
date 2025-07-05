"use client"

import { useRef } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useCategories } from "@/hooks/useCategories"

// Kategori renkleri
const getCategoryColor = (index: number): string => {
  const colors = [
    "bg-blue-500", "bg-red-500", "bg-green-500", "bg-purple-500",
    "bg-orange-500", "bg-indigo-500", "bg-emerald-500", "bg-cyan-500",
    "bg-pink-500", "bg-yellow-500", "bg-teal-500", "bg-violet-500",
    "bg-rose-500", "bg-amber-500", "bg-lime-500", "bg-sky-500"
  ];
  return colors[index % colors.length];
}

export default function HorizontalCategories() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "all"

  // Gerçek kategorileri al
  const { categories, loading: categoriesLoading } = useCategories()

  // Tüm Oyunlar kategorisini ekle - TÜM kategorileri göster
  const allCategories = [
    { id: "all", name: "Tüm Oyunlar", icon: "🎮", href: "/", color: "bg-blue-500", count: 0 },
    ...categories.map((cat, index) => ({
      ...cat,
      color: getCategoryColor(index + 1) // +1 çünkü ilk renk "Tüm Oyunlar" için kullanıldı
    }))
  ]

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  const isActive = (categoryId: string, href: string) => {
    if (href === "/games" && pathname === "/games" && !searchParams.toString()) return true
    if (categoryId && currentCategory === categoryId) return true
    return false
  }

  return (
    <div className="relative mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Kategoriler</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={scrollLeft}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollRight}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories Scroll Container */}
      <div className="relative">
        {/* Left Gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        
        {/* Right Gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Scrollable Categories */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categoriesLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border bg-card min-w-fit">
                <div className="w-8 h-8 rounded-lg bg-muted animate-pulse"></div>
                <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
              </div>
            ))
          ) : (
            allCategories.map((category) => {
            const active = isActive(category.id, category.href)
            
            return (
              <Link
                key={category.id}
                href={category.href}
                className={cn(
                  "group flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg min-w-fit",
                  active 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105" 
                    : "bg-card hover:bg-accent border-border hover:border-primary/50"
                )}
              >
                {/* Icon with background */}
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-12",
                  active ? "bg-primary-foreground/20" : category.color
                )}>
                  <span className="text-sm">{category.icon}</span>
                </div>
                
                {/* Category Name */}
                <span className="font-medium text-sm whitespace-nowrap">
                  {category.name}
                </span>

                {/* Active Indicator */}
                {active && (
                  <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                )}
              </Link>
            )
          })
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
