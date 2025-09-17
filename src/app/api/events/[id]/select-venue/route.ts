import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSlackNotification } from '@/lib/slack'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id
    const { venueId } = await request.json()

    if (!venueId) {
      return NextResponse.json(
        { error: '会場IDが必要です' },
        { status: 400 }
      )
    }

    // イベントと会場を取得
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    const venue = await prisma.eventVenueOption.findUnique({
      where: { id: venueId }
    })

    if (!event || !venue) {
      return NextResponse.json(
        { error: 'イベントまたは会場が見つかりません' },
        { status: 404 }
      )
    }

    if (event.status !== 'VENUE_SELECTION') {
      return NextResponse.json(
        { error: 'このイベントは会場選択段階ではありません' },
        { status: 400 }
      )
    }

    // イベントを更新（会場決定 + ステータス変更）
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        decided_venue: venue.name,
        decided_venue_url: venue.url,
        status: 'CONFIRMED',
      }
    })

    // 選択された会場をマーク
    await prisma.eventVenueOption.update({
      where: { id: venueId },
      data: {
        is_decided: true
      }
    })

    // Slack通知
    try {
      const decidedDateText = event.decided_date 
        ? new Date(event.decided_date).toLocaleString('ja-JP', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
          })
        : '未定'

      const slackMessage = {
        text: `🎉 「${event.title}」の会場が決定しました！`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `🎉 会場決定: ${event.title}`
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*📅 日時:* ${decidedDateText}\n*🏢 会場:* ${venue.name}\n*📍 住所:* ${venue.address || '住所情報なし'}`
            }
          },
          ...(venue.url ? [{
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '🔗 会場詳細'
                },
                url: venue.url
              }
            ]
          }] : [])
        ]
      }

      await sendSlackNotification(slackMessage)

      // 通知ログを保存
      await prisma.slackNotification.create({
        data: {
          event_id: eventId,
          type: 'VENUE_SELECTED',
          message: slackMessage.text,
          status: 'SENT',
        }
      })
    } catch (slackError) {
      console.error('Slack notification failed:', slackError)
    }

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Venue selection failed:', error)
    return NextResponse.json(
      { error: '会場選択に失敗しました' },
      { status: 500 }
    )
  }
}