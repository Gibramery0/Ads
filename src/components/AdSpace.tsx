"use client"

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface AdSpaceProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'banner' | 'leaderboard' | 'skyscraper' | 'square'
  responsive?: boolean
  className?: string
  style?: React.CSSProperties
}

// Google Ads boyutları
const AD_SIZES = {
  'banner': { width: 728, height: 90 },
  'leaderboard': { width: 728, height: 90 },
  'rectangle': { width: 300, height: 250 },
  'square': { width: 250, height: 250 },
  'skyscraper': { width: 160, height: 600 },
  'auto': { width: 'auto', height: 'auto' }
}

// Kaldırılacak reklam alanları
const DISABLED_AD_SLOTS = ['top-banner', 'content-bottom', 'bottom-banner']

export default function AdSpace({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className,
  style 
}: AdSpaceProps) {
  const adRef = useRef<HTMLElement>(null)

  // Eğer kaldırılacak reklam alanlarından biriyse boş div döndür
  if (DISABLED_AD_SLOTS.includes(slot)) {
    return null
  }

  useEffect(() => {
    // Google AdSense script'i yükle
    if (typeof window !== 'undefined' && !window.adsbygoogle) {
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX'
      script.crossOrigin = 'anonymous'
      document.head.appendChild(script)
    }

    // Reklam yükle
    try {
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle as any[]).push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  const adSize = AD_SIZES[format] || AD_SIZES.auto
  const isResponsive = responsive && format === 'auto'

  return (
    <div 
      className={cn(
        "ad-container flex items-center justify-center bg-muted/30 border border-dashed border-muted-foreground/20 rounded-lg",
        className
      )}
      style={{
        minHeight: format === 'auto' ? '100px' : `${adSize.height}px`,
        ...style
      }}
    >
      {/* Development placeholder */}
      {process.env.NODE_ENV === 'development' ? (
        <div className="text-center p-4">
          <div className="text-sm text-muted-foreground mb-2">
            📢 Ads Zone
          </div>
          <div className="text-xs text-muted-foreground">
            {format} • {slot}
          </div>
          {format !== 'auto' && (
            <div className="text-xs text-muted-foreground mt-1">
              {adSize.width}x{adSize.height}
            </div>
          )}
        </div>
      ) : (
        /* Production Google AdSense */
        <ins
          ref={adRef as any}
          className="adsbygoogle"
          style={{
            display: isResponsive ? 'block' : 'inline-block',
            width: isResponsive ? '100%' : `${adSize.width}px`,
            height: isResponsive ? 'auto' : `${adSize.height}px`,
          }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Gerçek Publisher ID'nizi buraya ekleyin
          data-ad-slot={slot}
          data-ad-format={isResponsive ? 'auto' : undefined}
          data-full-width-responsive={isResponsive ? 'true' : undefined}
        />
      )}
    </div>
  )
}

// Global types
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}
