import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { recommendVenuesWithAgent } from '@/lib/ai-agent'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        participants: true,
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'イベントが見つかりません' },
        { status: 404 }
      )
    }

    const recommendations = await recommendVenuesWithAgent(
      event.title,
      event.budget ?? undefined,
      event.participants.length,
      event.location_conditions ?? undefined
    )

    const venueOptions = await Promise.all(
      recommendations.venues.map((venue) =>
        prisma.eventVenueOption.create({
          data: {
            event_id: eventId,
            name: venue.name,
            address: venue.address,
            price_range: venue.budget,
            rating: venue.rating,
            url: venue.url,
          },
        })
      )
    )

    await prisma.event.update({
      where: { id: eventId },
      data: { status: 'VENUE_SELECTION' },
    })

    return NextResponse.json({
      success: true,
      venues: venueOptions,
      reasoning: recommendations.reasoning,
    })
  } catch (error) {
    console.error('Venue suggestion error:', error)
    return NextResponse.json(
      { error: '会場提案の生成に失敗しました' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id

    const venues = await prisma.eventVenueOption.findMany({
      where: { event_id: eventId },
    })

    return NextResponse.json(venues)
  } catch (error) {
    console.error('Fetch venues error:', error)
    return NextResponse.json(
      { error: '会場オプションの取得に失敗しました' },
      { status: 500 }
    )
  }
}