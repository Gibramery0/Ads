"use client"

import Link from 'next/link'
import { ArrowLeft, Construction } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Geri Dön
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center max-w-3xl text-center">
        <Construction className="h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4">Sayfa İnşaat Aşamasında</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          İletişim sayfamız şu anda hazırlanıyor. Çok yakında burada olacak!
        </p>
        <Link href="/">
          <Button>
            Ana Sayfaya Dön
          </Button>
        </Link>
      </div>
    </div>
  )
} 