import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Game from '@/lib/models/Game'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const id = params.id

    // Veritabanına bağlan
    await dbConnect()

    // Oyunu getir - MongoDB ObjectId, Id alanı veya slug ile arama
    const game = await Game.findOne({
      $or: [
        { _id: id },
        { Id: id },
        { slug: id }
      ]
    }).lean()

    if (!game) {
      return NextResponse.json(
        { error: 'Oyun bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(game)
  } catch (error) {
    console.error('Oyun getirilemedi:', error)
    return NextResponse.json(
      { error: 'Oyun getirilemedi' },
      { status: 500 }
    )
  }
} 