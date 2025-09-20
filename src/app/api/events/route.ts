import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const event = await prisma.event.create({
      data: {
        title,
        description: description || '',
        budget: budget ? parseInt(budget) : null,
        location_conditions: locationConditions || '',
        status: 'DATE_VOTING',
        date_options: {
          create: dateOptions.map((option: any) => ({
            date: new Date(`${option.date}T${option.time}`),
            votes: 0,
          })),
        },
        participants: {
          create: participants.map((participant: any) => ({
            slack_id: participant.slackId,
            name: participant.name,
            email: participant.email || null,
          })),
        },
        notifications: {
          create: {
            type: 'EVENT_CREATED',
            message: `イベント「${title}」が作成されました`,
            status: 'SENT',
          },
        },
      },
      include: {
        date_options: true,
        participants: true,
        venue_options: true,
        notifications: true,
      },
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
    const events = await prisma.event.findMany({
      include: {
        date_options: true,
        participants: true,
        venue_options: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Events fetch failed:', error)
    return NextResponse.json(
      { error: 'イベントの取得に失敗しました' },
      { status: 500 }
    )
  }
}