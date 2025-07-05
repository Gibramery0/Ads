"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthLayout from '@/components/auth/AuthLayout'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!email) {
        toast.error('Lütfen e-posta adresinizi girin')
        return
      }

      // Simulated password reset - replace with actual logic
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsEmailSent(true)
      toast.success('Şifre sıfırlama e-postası gönderildi!')

    } catch (error) {
      toast.error('E-posta gönderilirken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <AuthLayout
        title="E-posta Gönderildi"
        subtitle="Şifre sıfırlama talimatları e-posta adresinize gönderildi"
        showBackButton={false}
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <p className="text-muted-foreground">
              <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderdik.
            </p>
            <p className="text-sm text-muted-foreground">
              E-postayı görmüyorsanız spam klasörünüzü kontrol edin.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => setIsEmailSent(false)}
              variant="outline" 
              className="w-full"
            >
              Tekrar Gönder
            </Button>
            
            <Link href="/auth/login">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Giriş Sayfasına Dön
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Şifremi Unuttum"
      subtitle="E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">E-posta Adresi</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Gönderiliyor...
            </>
          ) : (
            'Şifre Sıfırlama Bağlantısı Gönder'
          )}
        </Button>

        {/* Back to Login */}
        <div className="text-center">
          <Link 
            href="/auth/login" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Giriş sayfasına dön
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
