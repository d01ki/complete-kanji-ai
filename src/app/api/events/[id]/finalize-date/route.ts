import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSlackNotification, createDateDecidedMessage } from '@/lib/slack'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id

    // イベントと日程候補を取得
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        date_options: {
          include: {
            date_votes: true
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'イベントが見つかりません' },
        { status: 404 }
      )
    }

    if (event.status !== 'DATE_VOTING') {
      return NextResponse.json(
        { error: 'このイベントは日程調整中ではありません' },
        { status: 400 }
      )
    }

    // 最も票数の多い日程を特定
    const mostVotedOption = event.date_options.reduce((max, option) => 
      option.date_votes.length > max.date_votes.length ? option : max
    )

    if (!mostVotedOption) {
      return NextResponse.json(
        { error: '日程候補が見つかりません' },
        { status: 400 }
      )
    }

    // イベントを更新（日程決定 + ステータス変更）
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        decided_date: mostVotedOption.date,
        status: 'VENUE_SELECTION',
      }
    })

    // Slack通知
    try {
      const decidedDateText = new Date(mostVotedOption.date).toLocaleString('ja-JP', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
      })

      const venueSelectionUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/events/${eventId}`
      const slackMessage = createDateDecidedMessage(event.title, decidedDateText, venueSelectionUrl)
      
      await sendSlackNotification(slackMessage)

      // 通知ログを保存
      await prisma.slackNotification.create({
        data: {
          event_id: eventId,
          type: 'DATE_DECIDED',
          message: slackMessage.text,
          status: 'SENT',
        }
      })
    } catch (slackError) {
      console.error('Slack notification failed:', slackError)
    }

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Date finalization failed:', error)
    return NextResponse.json(
      { error: '日程決定に失敗しました' },
      { status: 500 }
    )
  }
}