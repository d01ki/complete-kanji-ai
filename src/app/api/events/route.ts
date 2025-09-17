import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSlackNotification, createEventCreatedMessage } from '@/lib/slack'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, budget, locationConditions, dateOptions, participants } = body

    // バリデーション
    if (!title || !dateOptions?.length || !participants?.length) {
      return NextResponse.json(
        { error: 'タイトル、日程候補、参加者は必須です' },
        { status: 400 }
      )
    }

    // イベント作成
    const event = await prisma.event.create({
      data: {
        title,
        description,
        budget,
        location_conditions: locationConditions,
        status: 'DATE_VOTING',
        // 日程候補
        date_options: {
          create: dateOptions.map((option: any) => ({
            date: new Date(`${option.date}T${option.time}`),
          }))
        },
        // 参加者
        participants: {
          create: participants.map((participant: any) => ({
            slack_id: participant.slackId,
            name: participant.name,
            email: participant.email || null,
          }))
        }
      },
      include: {
        date_options: true,
        participants: true,
      }
    })

    // Slack通知
    try {
      const dateOptionsText = dateOptions.map((opt: any) => {
        const date = new Date(`${opt.date}T${opt.time}`)
        return date.toLocaleString('ja-JP', {
          month: 'numeric',
          day: 'numeric',
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })
      })

      const slackMessage = createEventCreatedMessage(title, dateOptionsText, event.id)
      await sendSlackNotification(slackMessage)

      // 通知ログをDBに保存
      await prisma.slackNotification.create({
        data: {
          event_id: event.id,
          type: 'EVENT_CREATED',
          message: slackMessage.text,
          status: 'SENT',
        }
      })
    } catch (slackError) {
      console.error('Slack notification failed:', slackError)
      // Slack通知失敗してもイベント作成は成功とする
    }

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
      orderBy: { created_at: 'desc' },
      include: {
        participants: true,
        date_options: true,
        venue_options: true,
      }
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