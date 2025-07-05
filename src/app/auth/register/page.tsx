"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import AuthLayout from '@/components/auth/AuthLayout'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptMarketing: false
  })

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    
    strength = Object.values(checks).filter(Boolean).length
    return { strength, checks }
  }

  const { strength, checks } = getPasswordStrength(formData.password)
  const strengthPercentage = (strength / 5) * 100
  const strengthColor = strength <= 2 ? 'bg-red-500' : strength <= 3 ? 'bg-yellow-500' : 'bg-green-500'
  const strengthText = strength <= 2 ? 'Zayıf' : strength <= 3 ? 'Orta' : 'Güçlü'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validation
      if (!formData.username || !formData.email || !formData.password) {
        toast.error('Lütfen tüm alanları doldurun')
        return
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Şifreler eşleşmiyor')
        return
      }

      if (strength < 3) {
        toast.error('Lütfen daha güçlü bir şifre seçin')
        return
      }

      if (!formData.acceptTerms) {
        toast.error('Kullanım koşullarını kabul etmelisiniz')
        return
      }

      // Simulated registration - replace with actual auth logic
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Hesabınız başarıyla oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...')
      
      setTimeout(() => {
        router.push('/auth/login')
      }, 1500)

    } catch (error) {
      toast.error('Kayıt olurken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialRegister = (provider: string) => {
    toast.info(`${provider} ile kayıt yakında eklenecek`)
  }

  return (
    <AuthLayout
      title="Hesap Oluştur"
      subtitle="Ücretsiz hesap oluştur ve binlerce oyuna erişim sağla"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Field */}
        <div className="space-y-2">
          <Label htmlFor="username">Kullanıcı Adı</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="kullaniciadi"
              value={formData.username}
              onChange={handleInputChange}
              className="pl-10"
              required
            />
          </div>
        </div>

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
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Şifre</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10 pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          
          {/* Password Strength */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Şifre Gücü</span>
                <span className={cn(
                  "font-medium",
                  strength <= 2 ? "text-red-500" : strength <= 3 ? "text-yellow-500" : "text-green-500"
                )}>
                  {strengthText}
                </span>
              </div>
              <Progress value={strengthPercentage} className="h-2" />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  {checks.length ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-red-500" />}
                  <span>En az 8 karakter</span>
                </div>
                <div className="flex items-center gap-1">
                  {checks.uppercase ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-red-500" />}
                  <span>Büyük harf</span>
                </div>
                <div className="flex items-center gap-1">
                  {checks.lowercase ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-red-500" />}
                  <span>Küçük harf</span>
                </div>
                <div className="flex items-center gap-1">
                  {checks.number ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-red-500" />}
                  <span>Rakam</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="pl-10 pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-xs text-red-500">Şifreler eşleşmiyor</p>
          )}
        </div>

        {/* Terms and Marketing */}
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) =>
                setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
              }
              className="mt-1"
            />
            <Label htmlFor="acceptTerms" className="text-sm leading-relaxed">
              <Link href="/terms" className="text-primary hover:underline">Kullanım Koşulları</Link> ve{' '}
              <Link href="/privacy" className="text-primary hover:underline">Gizlilik Politikası</Link>'nı
              okudum ve kabul ediyorum
            </Label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptMarketing"
              name="acceptMarketing"
              checked={formData.acceptMarketing}
              onCheckedChange={(checked) =>
                setFormData(prev => ({ ...prev, acceptMarketing: checked as boolean }))
              }
              className="mt-1"
            />
            <Label htmlFor="acceptMarketing" className="text-sm leading-relaxed">
              Yeni oyunlar ve özel teklifler hakkında e-posta almak istiyorum
            </Label>
          </div>
        </div>

        {/* Register Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !formData.acceptTerms}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Hesap oluşturuluyor...
            </>
          ) : (
            'Hesap Oluştur'
          )}
        </Button>

        {/* Divider */}
        <div className="relative">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-card px-2 text-xs text-muted-foreground">
              veya
            </span>
          </div>
        </div>

        {/* Social Register */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialRegister('Google')}
            className="w-full"
          >
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialRegister('GitHub')}
            className="w-full"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Zaten hesabın var mı?{' '}
            <Link
              href="/auth/login"
              className="text-primary hover:underline font-medium"
            >
              Giriş yap
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
