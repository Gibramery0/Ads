"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Star, TrendingUp, Instagram, Youtube } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCategories } from "@/hooks/useCategories"

// TikTok ve X ikonları için özel bileşenler
const TikTokIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.321 5.562a5.122 5.122 0 0 1-3.414-1.267 5.133 5.133 0 0 1-1.543-2.683H10.5v12.246c0 1.737-1.407 3.144-3.144 3.144a3.143 3.143 0 0 1-3.144-3.144 3.143 3.143 0 0 1 3.144-3.144c.36 0 .704.075 1.02.195v-3.928a7.01 7.01 0 0 0-1.02-.075c-3.858 0-7.02 3.162-7.02 7.02s3.162 7.02 7.02 7.02c3.858 0 7.02-3.162 7.02-7.02V8.979a8.499 8.499 0 0 0 5.139 1.707V6.822c-.06 0-.12 0-.18-.015a5.151 5.151 0 0 1-.994-1.245z"/>
  </svg>
)

const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>
)

const QUICK_LINKS = [
  { name: "Öne Çıkanlar", icon: Star, href: "/games?featured=true" },
  { name: "Popüler", icon: TrendingUp, href: "/games?popular=true" },
]

interface SidebarProps {
  isHidden?: boolean
  onToggle?: () => void
}

export default function Sidebar({ isHidden = false, onToggle }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [lastScrollPosition, setLastScrollPosition] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "all"
  const isFeatured = searchParams.get("featured") === "true"
  const isPopular = searchParams.get("popular") === "true"
  
  // Scroll pozisyonunu takip etmek için ref
  const sidebarContentRef = useRef<HTMLDivElement>(null)

  // Gerçek kategorileri al
  const { categories, loading: categoriesLoading } = useCategories()

  const isActive = (href: string, categoryId?: string) => {
    // Tüm Oyunlar butonu için özel mantık
    if (categoryId === "all") {
      return pathname === "/" && !currentCategory
    }

    // Diğer linkler için normal mantık
    if (href === "/" && pathname === "/" && !currentCategory) return true
    if (href === "/games" && pathname === "/games" && !searchParams.toString()) return true
    if (href.includes("featured") && isFeatured) return true
    if (href.includes("popular") && isPopular) return true
    if (categoryId && currentCategory === categoryId) return true
    return false
  }

  // Sidebar genişlik durumu
  const isExpanded = isHovered && !isHidden
  const isMinimized = !isHidden && !isHovered

  // Mouse enter handler
  const handleMouseEnter = () => {
    setIsTransitioning(true)
    setIsHovered(true)
    
    // Animasyon tamamlandıktan sonra scroll pozisyonunu ayarla
    setTimeout(() => {
      if (sidebarContentRef.current) {
        sidebarContentRef.current.scrollTop = lastScrollPosition
      }
      setIsTransitioning(false)
    }, 200) // CSS transition süresinden biraz daha uzun
  }
  
  // Mouse leave handler
  const handleMouseLeave = () => {
    // Mevcut scroll pozisyonunu kaydet
    if (sidebarContentRef.current) {
      setLastScrollPosition(sidebarContentRef.current.scrollTop)
    }
    setIsHovered(false)
  }
  
  // Scroll handler
  const handleScroll = () => {
    if (isExpanded && !isTransitioning && sidebarContentRef.current) {
      setLastScrollPosition(sidebarContentRef.current.scrollTop)
    }
  }

  // Sayfanın yeniden boyutlandırılması veya yönlendirilmesi durumunda scroll pozisyonunu sıfırla
  useEffect(() => {
    setLastScrollPosition(0)
    if (sidebarContentRef.current) {
      sidebarContentRef.current.scrollTop = 0
    }
  }, [pathname, searchParams])

  if (isHidden) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r transition-all duration-150 z-40 group",
        isExpanded ? "w-48" : "w-14"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={sidebarContentRef}
        onScroll={handleScroll}
        className={cn(
          "h-full flex flex-col",
          isExpanded ? "overflow-y-auto custom-scrollbar px-3 py-3" : "overflow-hidden px-3 py-3"
        )}
      >
        {/* Quick Links */}
        <div className="space-y-1">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "sidebar-item group flex items-center rounded-md text-xs transition-all duration-150 hover:bg-accent relative overflow-hidden h-7",
                  active ? "bg-accent text-accent-foreground font-medium active" : "text-muted-foreground",
                )}
                title={isMinimized ? link.name : undefined}
              >
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                  <Icon className="h-3.5 w-3.5 transition-all duration-150 group-hover:scale-110" />
                </div>
                {isExpanded && (
                  <span className="pl-8 transition-all duration-150 group-hover:translate-x-1 group-hover:opacity-70 whitespace-nowrap">
                    {link.name}
                  </span>
                )}
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform -skew-x-12" />
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150 -z-10" />
              </Link>
            )
          })}
        </div>

        {/* Divider */}
        {isExpanded && (
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-3/4 border-t border-border"></div>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-1">
          {/* Tüm Oyunlar */}
          <Link
            href="/"
            className={cn(
              "sidebar-item group flex items-center rounded-md text-xs transition-all duration-150 hover:bg-accent relative overflow-hidden h-7",
              isActive("/", "all") ? "bg-accent text-accent-foreground font-medium active" : "text-muted-foreground",
            )}
            title={isMinimized ? "Tüm Oyunlar" : undefined}
          >
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
              <span className="text-sm transition-all duration-150 group-hover:scale-110">🎮</span>
            </div>
            {isExpanded && (
              <span className="pl-8 transition-all duration-150 group-hover:translate-x-1 group-hover:opacity-70 whitespace-nowrap">
                Tüm Oyunlar
              </span>
            )}
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform -skew-x-12" />
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150 -z-10" />
          </Link>

          {/* Gerçek Kategoriler - TÜM kategorileri göster */}
          {!categoriesLoading && categories.map((category) => {
            const active = currentCategory === category.name

            return (
              <Link
                key={category.id}
                href={category.href}
                className={cn(
                  "sidebar-item group flex items-center rounded-md text-xs transition-all duration-150 hover:bg-accent relative overflow-hidden h-7",
                  active ? "bg-accent text-accent-foreground font-medium active" : "text-muted-foreground",
                )}
                title={isMinimized ? `${category.name} (${category.count})` : undefined}
              >
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                  <span className="text-sm transition-all duration-150 group-hover:scale-110">{category.icon}</span>
                </div>
                {isExpanded && (
                  <span className="pl-8 transition-all duration-150 group-hover:translate-x-1 group-hover:opacity-70 whitespace-nowrap">
                    {category.name}
                    <span className="text-[10px] opacity-60 ml-1">({category.count})</span>
                  </span>
                )}
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform -skew-x-12" />
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150 -z-10" />
              </Link>
            )
          })}

          {/* Loading state */}
          {categoriesLoading && (
            <div className="space-y-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i} 
                  className="relative h-7 flex items-center"
                >
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                    <div className="w-4 h-4 bg-muted rounded animate-pulse"></div>
                  </div>
                  {isExpanded && (
                    <div className="pl-8 w-20 h-3 bg-muted rounded animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Links */}
        {isExpanded && (
          <div className="mt-auto pt-4 border-t space-y-3">
            {/* About Links */}
            <div className="space-y-0.5">
              <Link href="/about" className="block text-xs text-muted-foreground hover:text-primary transition-colors">
                Hakkımızda
              </Link>
              <Link href="/contact" className="block text-xs text-muted-foreground hover:text-primary transition-colors">
                İletişim
              </Link>
              <Link href="/privacy" className="block text-xs text-muted-foreground hover:text-primary transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/terms" className="block text-xs text-muted-foreground hover:text-primary transition-colors">
                Kullanım Koşulları
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 justify-center">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-blue-600 transition-colors"
                title="Facebook"
              >
                <TikTokIcon />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-sky-500 transition-colors"
                title="Twitter"
              >
                <XIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-pink-500 transition-colors"
                title="Instagram"
              >
                <TikTokIcon />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-red-500 transition-colors"
                title="YouTube"
              >
                <XIcon />
              </a>
            </div>

            {/* Copyright */}
            <div className="pt-2 border-t">
              <p className="text-[10px] text-muted-foreground text-center">
                © 2025 ALL DAY GAME<br />
                Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
