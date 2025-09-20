import { NextRequest, NextResponse } from 'next/server'
import { createEvent, getAllEvents } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, budget, locationConditions, dateOptions, participants } = body

    if (!title || !dateOptions?.length || !participants?.length) {
      return NextResponse.json(
        { error: 'タイトル、日程候補、参加者は必須です' },
        { status: 400 }
      )
    }

    const event = await createEvent({
      title,
      description: description || '',
      budget: budget ? parseInt(budget) : undefined,
      location_conditions: locationConditions || '',
      status: 'DATE_VOTING',
      date_options: dateOptions.map((option: any) => ({
        id: `date_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: `${option.date}T${option.time}`,
        votes: 0,
        voter_ids: []
      })),
      participants: participants.map((participant: any, index: number) => ({
        id: `part_${Date.now()}_${index}`,
        slack_id: participant.slackId,
        name: participant.name,
        email: participant.email || ''
      })),
      venue_options: [],
      notifications: [{
        id: `notif_${Date.now()}`,
        type: 'EVENT_CREATED',
        message: `イベント「${title}」が作成されました`,
        sent_at: new Date().toISOString(),
        status: 'SENT'
      }]
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Event creation failed:', error)
    return NextResponse.json(
      { error: 'イベントの作成に失敗しました' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const events = await getAllEvents()
    return NextResponse.json(events)
  } catch (error) {
    console.error('Events fetch failed:', error)
    return NextResponse.json(
      { error: 'イベントの取得に失敗しました' },
      { status: 500 }
    )
  }
}