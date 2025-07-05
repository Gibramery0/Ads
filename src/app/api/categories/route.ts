import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Game from '@/lib/models/Game'

export async function GET() {
  try {
    // Veritabanına bağlan
    await dbConnect()

    // Tüm benzersiz kategorileri getir
    const categories = await Game.distinct('category')

    // Kategorileri formatlı hale getir
    const formattedCategories = categories.map((category: string) => ({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error('Kategoriler getirilemedi:', error)
    return NextResponse.json(
      { error: 'Kategoriler getirilemedi' },
      { status: 500 }
    )
  }
} 