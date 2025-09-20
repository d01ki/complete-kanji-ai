import { NextRequest, NextResponse } from 'next/server'
import { getEventById, updateEvent, addNotification } from '@/lib/db'

interface Params {
  params: { id: string }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { venueOptionId } = await request.json()

    if (!venueOptionId) {
      return NextResponse.json(
        { error: '会場IDが必要です' },
        { status: 400 }
      )
    }

    const event = await getEventById(params.id)
    if (!event) {
      return NextResponse.json(
        { error: 'イベントが見つかりません' },
        { status: 404 }
      )
    }

    const venueOption = event.venue_options.find(v => v.id === venueOptionId)
    if (!venueOption) {
      return NextResponse.json(
        { error: '会場候補が見つかりません' },
        { status: 404 }
      )
    }

    const updatedEvent = await updateEvent(params.id, {
      decided_venue: venueOption.name,
      decided_venue_url: venueOption.url,
      status: 'CONFIRMED'
    })

    await addNotification(params.id, {
      type: 'VENUE_DECIDED',
      message: `会場が決定されました: ${venueOption.name}`,
      status: 'SENT'
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Venue decision failed:', error)
    return NextResponse.json(
      { error: '会場の決定に失敗しました' },
      { status: 500 }
    )
  }
}