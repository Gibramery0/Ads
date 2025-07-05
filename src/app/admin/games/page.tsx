"use client"

import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_ADMIN_GAMES, GET_GAME_CATEGORIES } from '@/lib/graphql/queries'
import { UPDATE_GAME_FEATURED, DELETE_GAME } from '@/lib/graphql/mutations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { Edit, Trash2, Plus, Search } from 'lucide-react'

export default function AdminGamesPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [searchTerm])
  
  // Fetch games
  const { data, loading, error, refetch } = useQuery(GET_ADMIN_GAMES, {
    variables: {
      page,
      limit,
      search: debouncedSearch,
      category: categoryFilter || undefined
    },
    fetchPolicy: 'network-only'
  })
  
  // Fetch categories
  const { data: categoriesData } = useQuery(GET_GAME_CATEGORIES)
  
  // Mutations
  const [updateGameFeatured] = useMutation(UPDATE_GAME_FEATURED, {
    onCompleted: () => {
      toast.success('Oyun durumu güncellendi')
    },
    onError: (error) => {
      toast.error(`Hata: ${error.message}`)
    }
  })
  
  const [deleteGame] = useMutation(DELETE_GAME, {
    onCompleted: () => {
      toast.success('Oyun başarıyla silindi')
      refetch()
    },
    onError: (error) => {
      toast.error(`Hata: ${error.message}`)
    }
  })
  
  const handleFeaturedToggle = (id, featured) => {
    updateGameFeatured({
      variables: {
        id,
        featured: !featured
      }
    })
  }
  
  const handleDeleteGame = (id) => {
    if (confirm('Bu oyunu silmek istediğinize emin misiniz?')) {
      deleteGame({
        variables: { id }
      })
    }
  }
  
  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1) // Reset to first page on new search
  }
  
  const games = data?.adminGames?.games || []
  const totalPages = data?.adminGames?.pageCount || 1
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Oyun Yönetimi</h1>
        <Link href="/admin/games/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Oyun Ekle
          </Button>
        </Link>
      </div>
      
      {/* Filtreler */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Oyun ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={categoryFilter} onValueChange={(value) => {
            setCategoryFilter(value)
            setPage(1) // Reset to first page on category change
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              {categoriesData?.gameCategories?.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-32">
          <Select value={limit.toString()} onValueChange={(val) => {
            setLimit(Number(val))
            setPage(1) // Reset to first page on limit change
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">
          <Search className="mr-2 h-4 w-4" />
          Ara
        </Button>
      </form>
      
      {/* Oyun Tablosu */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">ID</TableHead>
              <TableHead className="w-12">Görsel</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Oynanma</TableHead>
              <TableHead className="w-24">Öne Çıkan</TableHead>
              <TableHead className="w-24">Tarih</TableHead>
              <TableHead className="w-24">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">Yükleniyor...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-destructive">
                  Hata: {error.message}
                </TableCell>
              </TableRow>
            ) : games.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">Oyun bulunamadı</TableCell>
              </TableRow>
            ) : (
              games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="font-mono text-xs">{game.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    <div className="w-10 h-10 relative rounded overflow-hidden">
                      {game.thumbnail ? (
                        <Image 
                          src={game.thumbnail} 
                          alt={game.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                          No img
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{game.title}</TableCell>
                  <TableCell>{game.category}</TableCell>
                  <TableCell className="text-right">{game.playCount || 0}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={game.featured} 
                      onCheckedChange={() => handleFeaturedToggle(game.id, game.featured)}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(game.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/games/edit/${game.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteGame(game.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {!loading && games.length > 0 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Önceki
            </Button>
            
            <span className="mx-2">
              Sayfa {page} / {totalPages}
            </span>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
