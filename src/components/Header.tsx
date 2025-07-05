"use client"

import { useState, useRef, useEffect, FormEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "./ui/button"
import { Search, Menu, Loader2, X, Dice5 } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeaderProps {
  onSidebarToggle?: () => void
}

export default function Header({ onSidebarToggle }: HeaderProps) {
  const [hideHeader, setHideHeader] = useState(false)
  const lastScrollY = useRef(0)
  const pathname = usePathname()
  const router = useRouter()
  
  // Arama işlevi için state
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // Scroll olayını dinle
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHideHeader(true)
      } else {
        setHideHeader(false)
      }
      
      lastScrollY.current = currentScrollY
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  // Arama işlevi
  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearching(true)
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearching(false)
    }
  }
  
  // Arama temizleme
  const clearSearch = () => {
    setSearchQuery("")
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }
  
  // Rastgele oyun seçme işlevi
  const handleRandomGame = async () => {
    try {
      // API'den rastgele bir oyun getir
      const response = await fetch('/api/games?limit=1&random=true');
      
      if (!response.ok) {
        throw new Error('Rastgele oyun getirilemedi');
      }
      
      const data = await response.json();
      
      // Eğer oyun varsa, o oyuna yönlendir
      if (data.games && data.games.length > 0) {
        const randomGame = data.games[0];
        const gameId = randomGame._id || randomGame.id || randomGame.Id;
        
        if (gameId) {
          router.push(`/game/${gameId}`);
        } else {
          console.error('Oyun ID\'si bulunamadı');
        }
      } else {
        console.error('Hiç oyun bulunamadı');
      }
    } catch (error) {
      console.error('Rastgele oyun seçerken hata oluştu:', error);
    }
  };
  
  return (
    <header className={`border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ${hideHeader ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="h-10 w-10 border-2 border-border hover:border-primary/50 transition-colors"
          >
            <Menu className="h-5 w-5 stroke-2" />
          </Button>

          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo with Hover Animation */}
            <div className="relative transition-all duration-500 group-hover:scale-110 group-hover:-translate-x-2">
              {/* Default Logo */}
              <Image
                src="/logo.png"
                alt="All Day Game Logo"
                width={56}
                height={56}
                className="object-contain w-12 h-12 md:w-14 md:h-14 transition-opacity duration-500 group-hover:opacity-0"
                priority
              />
              {/* Hover Logo */}
              <Image
                src="/logo_after.png"
                alt="All Day Game Logo Hover"
                width={56}
                height={56}
                className="object-contain w-12 h-12 md:w-14 md:h-14 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                priority
              />
            </div>

            {/* Brand Text */}
            <div className="text-center transition-all duration-300 group-hover:translate-x-1">
              <div className={cn(
                "text-lg font-bold leading-tight font-orbitron tracking-[0.2em]",
                "bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent",
                "drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,1)]",
                "border-b border-white/20 pb-0.5 mb-0.5",
                "relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-white after:w-full",
                "after:animate-pulse after:opacity-70",
                "neon-text"
              )}>
                ALL DAY
              </div>
              <div className={cn(
                "text-lg font-bold leading-tight font-orbitron tracking-[0.2em]",
                "bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent",
                "drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,1)]",
                "relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-white after:w-0",
                "after:transition-all after:duration-1000 group-hover:after:w-full",
                "neon-scan"
              )}>
                GAME
              </div>
            </div>
          </Link>
        </div>

        {/* Ortalanmış Arama Çubuğu */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
          <form className="relative w-80" onSubmit={handleSearch}>
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Oyun ara..."
              className="w-full rounded-full border border-input bg-background py-2 pl-4 pr-10 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Aramayı temizle"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isSearching}
              aria-label="Ara"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </form>
        </div>

        <div className="flex items-center gap-4">
          {/* Rastgele Oyun Butonu */}
          <Button 
            variant="outline" 
            size="sm" 
            className="flex gap-2"
            onClick={handleRandomGame}
          >
            <Dice5 className="h-4 w-4" />
            <span className="hidden sm:inline">Şans</span>
          </Button>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
} 