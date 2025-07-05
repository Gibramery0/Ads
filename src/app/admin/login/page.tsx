"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@apollo/client'
import { LOGIN } from '@/lib/graphql/mutations'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  
  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      if (data?.login) {
        localStorage.setItem('token', data.login)
        toast.success('Giriş başarılı!')
        router.push('/admin')
      } else {
        setErrorMsg('Giriş başarısız: Geçersiz yanıt')
        toast.error('Giriş başarısız: Geçersiz yanıt')
      }
    },
    onError: (error) => {
      console.error('Login error:', error)
      setErrorMsg(`Giriş başarısız: ${error.message}`)
      toast.error(`Giriş başarısız: ${error.message}`)
    }
  })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    
    // Basit doğrulama
    if (!email || !password) {
      setErrorMsg('E-posta ve şifre gereklidir')
      toast.error('E-posta ve şifre gereklidir')
      return
    }
    
    try {
      login({ 
        variables: { email, password },
        // Hata durumunda yeniden deneme
        errorPolicy: 'all'
      })
    } catch (err) {
      console.error('Login submission error:', err)
      setErrorMsg('Bir hata oluştu, lütfen tekrar deneyin')
      toast.error('Bir hata oluştu, lütfen tekrar deneyin')
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-orbitron">Admin Girişi</CardTitle>
          <CardDescription>
            Yönetim paneline erişmek için giriş yapın
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {errorMsg}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Giriş yapılıyor...
                </>
              ) : 'Giriş Yap'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
