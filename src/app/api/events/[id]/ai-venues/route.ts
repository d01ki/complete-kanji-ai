import { NextRequest, NextResponse } from 'next/server'
import { getEventById, addVenueOption } from '@/lib/db'
import { getAIRecommendedRestaurants } from '@/lib/tabelog'

interface Params {
  params: { id: string }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const event = await getEventById(params.id)

    if (!event) {
      return NextResponse.json(
        { error: 'イベントが見つかりません' },
        { status: 404 }
      )
    }

    // AI推薦を使って実在する店舗を取得
    const restaurants = await getAIRecommendedRestaurants({
      title: event.title,
      participants: event.participants.length,
      budget: event.budget,
      location: event.location_conditions || '新宿',
      preferences: event.description || ''
    })

    const createdVenues = []
    for (const restaurant of restaurants) {
      const venue = {
        name: restaurant.name,
        address: restaurant.address,
        price_range: restaurant.price_range,
        rating: restaurant.rating,
        url: restaurant.url
      }
      
      const created = await addVenueOption(event.id, venue)
      if (created) createdVenues.push(created)
    }

    return NextResponse.json({ 
      venues: createdVenues,
      message: `${createdVenues.length}件の実在するお店を提案しました` 
    })
  } catch (error) {
    console.error('AI venue recommendation failed:', error)
    return NextResponse.json(
      { error: '会場提案の取得に失敗しました' },
      { status: 500 }
    )
  }
}