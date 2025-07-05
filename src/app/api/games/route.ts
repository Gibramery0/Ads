import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Game from '@/lib/models/Game'
import mongoose from 'mongoose'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured') === 'true'
    const popular = searchParams.get('popular') === 'true'
    const search = searchParams.get('search')
    const random = searchParams.get('random') === 'true'
    const limit = Number(searchParams.get('limit') || '20')
    const page = Number(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    // Veritabanına bağlan
    console.log('Connecting to database...')
    await dbConnect()
    console.log('Connected to database')

    // Sorgu koşullarını oluştur
    const query: any = {}

    if (category) {
      // MongoDB'deki Genres alanında arama yap
      query.$or = [
        { 'Genres.0': { $regex: new RegExp(category, 'i') } },
        { 'Genres': { $regex: new RegExp(category, 'i') } },
        { 'category': { $regex: new RegExp(category, 'i') } }
      ]
    }
    
    if (featured) {
      query.featured = true
    }
    
    if (popular) {
      query.popular = true
    }
    
    // Arama sorgusu varsa
    if (search) {
      // Eğer zaten $or varsa, onu bir $and içine al ve arama sorgusunu ekle
      if (query.$or) {
        query.$and = [
          { $or: query.$or },
          {
            $or: [
              { 'Title': { $regex: new RegExp(search, 'i') } },
              { 'title': { $regex: new RegExp(search, 'i') } },
              { 'Description': { $regex: new RegExp(search, 'i') } },
              { 'description': { $regex: new RegExp(search, 'i') } },
              { 'Genres': { $regex: new RegExp(search, 'i') } },
              { 'category': { $regex: new RegExp(search, 'i') } },
              { 'Developer': { $regex: new RegExp(search, 'i') } },
              { 'developer': { $regex: new RegExp(search, 'i') } }
            ]
          }
        ]
        delete query.$or
      } else {
        // $or yoksa, doğrudan arama sorgusunu ekle
        query.$or = [
          { 'Title': { $regex: new RegExp(search, 'i') } },
          { 'title': { $regex: new RegExp(search, 'i') } },
          { 'Description': { $regex: new RegExp(search, 'i') } },
          { 'description': { $regex: new RegExp(search, 'i') } },
          { 'Genres': { $regex: new RegExp(search, 'i') } },
          { 'category': { $regex: new RegExp(search, 'i') } },
          { 'Developer': { $regex: new RegExp(search, 'i') } },
          { 'developer': { $regex: new RegExp(search, 'i') } }
        ]
      }
    }

    console.log('Query:', JSON.stringify(query))

    // Toplam sayıyı getir
    const total = await Game.countDocuments(query)

    let games;
    
    // Rastgele oyun istendiyse
    if (random) {
      games = await Game.aggregate([
        { $match: query },
        { $sample: { size: limit } }
      ])
    } else {
      // Normal sıralı oyunları getir
      games = await Game.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    }

    console.log(`Found ${games.length} games out of ${total} total`)
    
    // Eğer oyun bulunamadıysa, koleksiyon adını kontrol et
    if (games.length === 0 && page === 1) {
      const db = mongoose.connection.db
      if (db) {
        const collections = await db.listCollections().toArray()
        console.log('Available collections:', collections.map(c => c.name))
      }
    }

    return NextResponse.json({
      games,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasMore: skip + games.length < total
    })
  } catch (error: unknown) {
    console.error('Oyunlar getirilemedi:', error)
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json(
      { error: 'Oyunlar getirilemedi', details: errorMessage },
      { status: 500 }
    )
  }
} 