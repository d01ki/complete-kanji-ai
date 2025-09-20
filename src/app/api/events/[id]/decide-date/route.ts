import { NextRequest, NextResponse } from 'next/server'
import { getEventById, updateEvent, addNotification } from '@/lib/db'

interface Params {
  params: { id: string }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { dateOptionId } = await request.json()

    if (!dateOptionId) {
      return NextResponse.json(
        { error: '日程IDが必要です' },
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

    const dateOption = event.date_options.find(d => d.id === dateOptionId)
    if (!dateOption) {
      return NextResponse.json(
        { error: '日程候補が見つかりません' },
        { status: 404 }
      )
    }

    const updatedEvent = await updateEvent(params.id, {
      decided_date: dateOption.date,
      status: 'VENUE_SELECTION'
    })

    await addNotification(params.id, {
      type: 'DATE_DECIDED',
      message: `日程が決定されました: ${new Date(dateOption.date).toLocaleString('ja-JP')}`,
      status: 'SENT'
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Date decision failed:', error)
    return NextResponse.json(
      { error: '日程の決定に失敗しました' },
      { status: 500 }
    )
  }
}