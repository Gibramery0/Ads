"use client"

import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  showBackButton?: boolean
}

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showBackButton = true 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Header */}
      {showBackButton && (
        <div className="relative z-10 p-4">
          <div className="max-w-6xl mx-auto">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Ana Sayfa
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          {/* Auth Card */}
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>

            {/* Form Content */}
            {children}
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>© 2024 Tüm hakları saklıdır.</p>
          </div>
        </div>
      </div>

      {/* Floating Game Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl opacity-10 animate-float">🎮</div>
        <div className="absolute top-40 right-20 text-3xl opacity-10 animate-float-delayed">🎯</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-float">🏎️</div>
        <div className="absolute bottom-20 right-10 text-3xl opacity-10 animate-float-delayed">🧩</div>
        <div className="absolute top-60 left-1/2 text-4xl opacity-10 animate-float">⚽</div>
      </div>
    </div>
  )
}
