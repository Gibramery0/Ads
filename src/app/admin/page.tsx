"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@apollo/client'
import { GET_GAMES_STATS } from '@/lib/graphql/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart, 
  Users, 
  GamepadIcon, 
  Activity, 
  Settings,
  LogOut
} from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Admin kimlik doğrulama kontrolü
  useEffect(() => {
    const token = localStorage.getItem('token')
    // Basit bir kontrol - gerçek uygulamada JWT doğrulaması yapılmalı
    if (!token) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])
  
  const { data, loading } = useQuery(GET_GAMES_STATS)
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/admin/login')
  }
  
  if (!isAuthenticated) {
    return <div className="flex items-center justify-center h-screen">Yükleniyor...</div>
  }
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Admin Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r bg-background">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <div className="flex flex-col gap-1 p-4 flex-1">
          <Link href="/admin">
            <Button variant="ghost" className="justify-start w-full">
              <BarChart className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/games">
            <Button variant="ghost" className="justify-start w-full">
              <GamepadIcon className="mr-2 h-4 w-4" />
              Oyunlar
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="ghost" className="justify-start w-full">
              <Users className="mr-2 h-4 w-4" />
              Kullanıcılar
            </Button>
          </Link>
          <Link href="/admin/stats">
            <Button variant="ghost" className="justify-start w-full">
              <Activity className="mr-2 h-4 w-4" />
              İstatistikler
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="ghost" className="justify-start w-full">
              <Settings className="mr-2 h-4 w-4" />
              Ayarlar
            </Button>
          </Link>
          
          <div className="mt-auto">
            <Button 
              variant="ghost" 
              className="justify-start w-full text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b p-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold">Admin Panel</h2>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 p-8 md:p-8 mt-16 md:mt-0">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Toplam Oyun</CardTitle>
              <GamepadIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : data?.gamesStats?.totalGames || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Toplam Oynanma</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : data?.gamesStats?.totalPlays || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Kullanıcılar</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : data?.gamesStats?.totalUsers || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Öne Çıkan Oyunlar</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : data?.gamesStats?.featuredGames || 0}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for different sections */}
        <Tabs defaultValue="recent">
          <TabsList>
            <TabsTrigger value="recent">Son Eklenenler</TabsTrigger>
            <TabsTrigger value="popular">En Popüler</TabsTrigger>
            <TabsTrigger value="featured">Öne Çıkanlar</TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="p-4 border rounded-md mt-2">
            <h3 className="text-lg font-semibold mb-4">Son Eklenen Oyunlar</h3>
            {/* Burada oyun listesi gelecek */}
            <p className="text-muted-foreground">Yükleniyor...</p>
          </TabsContent>
          <TabsContent value="popular" className="p-4 border rounded-md mt-2">
            <h3 className="text-lg font-semibold mb-4">En Popüler Oyunlar</h3>
            {/* Burada oyun listesi gelecek */}
            <p className="text-muted-foreground">Yükleniyor...</p>
          </TabsContent>
          <TabsContent value="featured" className="p-4 border rounded-md mt-2">
            <h3 className="text-lg font-semibold mb-4">Öne Çıkan Oyunlar</h3>
            {/* Burada oyun listesi gelecek */}
            <p className="text-muted-foreground">Yükleniyor...</p>
          </TabsContent>
        </Tabs>
        
        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t">
          <div className="grid grid-cols-5 gap-1 p-2">
            <Link href="/admin">
              <Button variant="ghost" className="w-full flex flex-col items-center py-2 h-auto">
                <BarChart className="h-5 w-5 mb-1" />
                <span className="text-xs">Ana Sayfa</span>
              </Button>
            </Link>
            <Link href="/admin/games">
              <Button variant="ghost" className="w-full flex flex-col items-center py-2 h-auto">
                <GamepadIcon className="h-5 w-5 mb-1" />
                <span className="text-xs">Oyunlar</span>
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="ghost" className="w-full flex flex-col items-center py-2 h-auto">
                <Users className="h-5 w-5 mb-1" />
                <span className="text-xs">Kullanıcılar</span>
              </Button>
            </Link>
            <Link href="/admin/stats">
              <Button variant="ghost" className="w-full flex flex-col items-center py-2 h-auto">
                <Activity className="h-5 w-5 mb-1" />
                <span className="text-xs">İstatistik</span>
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="ghost" className="w-full flex flex-col items-center py-2 h-auto">
                <Settings className="h-5 w-5 mb-1" />
                <span className="text-xs">Ayarlar</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}