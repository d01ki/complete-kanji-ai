import { NextRequest, NextResponse } from 'next/server'
import { getEventById, addVenueOption } from '@/lib/db'

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

    // OpenAI APIキーがない場合やシンプルな実装としてダミーデータを使用
    const locations = event.location_conditions?.toLowerCase() || '新宿'
    const budgetRange = event.budget ? `¥${event.budget - 1000}-${event.budget + 1000}` : '¥4000-6000'
    
    const dummyVenues = [
      {
        name: `${locations}駅前 個室居酒屋 龍`,
        address: `東京都${locations}周辺`,
        price_range: budgetRange,
        rating: 4.2,
        url: 'https://tabelog.com/example1'
      },
      {
        name: `${locations} 和風ダイニング 雅`,
        address: `東京都${locations}周辺`,
        price_range: budgetRange,
        rating: 4.5,
        url: 'https://tabelog.com/example2'
      },
      {
        name: `${locations} プライベートダイニング 蔦`,
        address: `東京都${locations}周辺`,
        price_range: budgetRange,
        rating: 4.7,
        url: 'https://tabelog.com/example3'
      }
    ]

    const createdVenues = []
    for (const venue of dummyVenues) {
      const created = await addVenueOption(event.id, venue)
      if (created) createdVenues.push(created)
    }

    return NextResponse.json({ venues: createdVenues })
  } catch (error) {
    console.error('AI venue recommendation failed:', error)
    return NextResponse.json(
      { error: '会場提案の取得に失敗しました' },
      { status: 500 }
    )
  }
}