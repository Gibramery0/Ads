import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Game from '@/lib/models/Game'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Arama sorgusu en az 2 karakter olmalıdır' },
        { status: 400 }
      )
    }

    // Veritabanına bağlan
    await dbConnect()

    // Arama yap
    const games = await Game.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    })
      .limit(20)
      .lean()

    return NextResponse.json(games)
  } catch (error) {
    console.error('Arama yapılamadı:', error)
    return NextResponse.json(
      { error: 'Arama yapılamadı' },
      { status: 500 }
    )
  }
} 