import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addToGoogleCalendar, generateICalEvent } from '@/lib/google-calendar'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id
    const body = await request.json()
    const { venueId, confirmReservation } = body

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        participants: true,
        venue_options: true,
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'イベントが見つかりません' },
        { status: 404 }
      )
    }

    const venue = event.venue_options.find(v => v.id === venueId)
    if (!venue) {
      return NextResponse.json(
        { error: '会場が見つかりません' },
        { status: 404 }
      )
    }

    if (!event.decided_date) {
      return NextResponse.json(
        { error: '日程が決定されていません' },
        { status: 400 }
      )
    }

    // 会場を決定
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        decided_venue: venue.name,
        decided_venue_url: venue.url,
        decided_venue_id: venue.id,
        reservation_status: confirmReservation ? 'RESERVED' : 'PENDING',
        status: confirmReservation ? 'CONFIRMED' : 'VENUE_SELECTION',
      },
    })

    // Googleカレンダーに追加
    if (confirmReservation) {
      const startTime = new Date(event.decided_date)
      const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000) // 3時間後

      const calendarEvent = {
        summary: event.title,
        description: `${event.description || ''}\n\n会場: ${venue.name}\n住所: ${venue.address}\nURL: ${venue.url}`,
        location: venue.address || venue.name,
        startTime,
        endTime,
        attendees: event.participants
          .filter(p => p.email)
          .map(p => p.email!),
      }

      const calendarResult = await addToGoogleCalendar(calendarEvent)

      // iCal形式でも提供
      const icalData = generateICalEvent(calendarEvent)

      return NextResponse.json({
        success: true,
        event: updatedEvent,
        calendar: calendarResult,
        icalData,
        message: '会場が決定し、カレンダーに追加されました',
      })
    }

    return NextResponse.json({
      success: true,
      event: updatedEvent,
      message: '会場が選択されました。予約を確定してください。',
    })
  } catch (error) {
    console.error('Reservation error:', error)
    return NextResponse.json(
      { error: '予約処理に失敗しました' },
      { status: 500 }
    )
  }
}