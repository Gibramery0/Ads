"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_GAME } from '@/lib/graphql/mutations'
import { GET_GAME_CATEGORIES } from '@/lib/graphql/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AddGamePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    category: '',
    developer: '',
    thumbnail: '',
    gameUrl: '',
    featured: false
  })
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  
  // Fetch categories
  const { data: categoriesData } = useQuery(GET_GAME_CATEGORIES)
  
  // Add game mutation
  const [addGame, { loading }] = useMutation(ADD_GAME, {
    onCompleted: () => {
      toast.success('Oyun başarıyla eklendi')
      router.push('/admin/games')
    },
    onError: (error) => {
      toast.error(`Hata: ${error.message}`)
    }
  })
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }
  
  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.title || !formData.category || !formData.gameUrl) {
      toast.error('Lütfen gerekli alanları doldurun')
      return
    }
    
    // Handle thumbnail upload if exists
    let thumbnailUrl = formData.thumbnail
    if (thumbnailFile) {
      // Burada gerçek bir dosya yükleme işlemi yapılmalı
      // Örnek olarak doğrudan base64 kullanıyoruz
      thumbnailUrl = thumbnailPreview
    }
    
    // Submit form
    addGame({
      variables: {
        input: {
          ...formData,
          thumbnail: thumbnailUrl
        }
      }
    })
  }
  
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/games">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Yeni Oyun Ekle</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Oyun Adı *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Oyun adını girin"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Kategori *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {categoriesData?.gameCategories?.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="developer">Geliştirici</Label>
            <Input
              id="developer"
              name="developer"
              value={formData.developer}
              onChange={handleInputChange}
              placeholder="Geliştirici adını girin"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gameUrl">Oyun URL *</Label>
            <Input
              id="gameUrl"
              name="gameUrl"
              value={formData.gameUrl}
              onChange={handleInputChange}
              placeholder="Oyun URL'sini girin"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Açıklama</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Oyun açıklamasını girin"
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instructions">Oyun Talimatları</Label>
          <Textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleInputChange}
            placeholder="Oyun talimatlarını girin"
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="thumbnail">Görsel URL</Label>
          <Input
            id="thumbnail"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleInputChange}
            placeholder="Görsel URL'sini girin"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="thumbnailFile">Veya Görsel Yükle</Label>
          <Input
            id="thumbnailFile"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
          
          {thumbnailPreview && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground mb-2">Önizleme:</p>
              <div className="w-40 h-40 relative rounded overflow-hidden border">
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
          />
          <Label htmlFor="featured">Öne Çıkan Oyun</Label>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.push('/admin/games')}
          >
            İptal
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Oyunu Kaydet'}
          </Button>
        </div>
      </form>
    </div>
  )
}