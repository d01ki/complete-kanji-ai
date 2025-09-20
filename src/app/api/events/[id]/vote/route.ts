import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id
    const body = await request.json()
    const { dateOptionId, participantSlackId } = body

    if (!dateOptionId || !participantSlackId) {
      return NextResponse.json(
        { error: '日程オプションIDと参加者IDが必要です' },
        { status: 400 }
      )
    }

    const existingVote = await prisma.dateVote.findUnique({
      where: {
        date_option_id_participant_slack_id: {
          date_option_id: dateOptionId,
          participant_slack_id: participantSlackId,
        },
      },
    })

    if (existingVote) {
      await prisma.dateVote.delete({
        where: {
          id: existingVote.id,
        },
      })

      const dateOption = await prisma.eventDateOption.findUnique({
        where: { id: dateOptionId },
        include: { date_votes: true },
      })

      await prisma.eventDateOption.update({
        where: { id: dateOptionId },
        data: { votes: dateOption?.date_votes.length ?? 0 },
      })

      return NextResponse.json({
        success: true,
        action: 'removed',
      })
    } else {
      await prisma.dateVote.create({
        data: {
          date_option_id: dateOptionId,
          participant_slack_id: participantSlackId,
        },
      })

      const dateOption = await prisma.eventDateOption.findUnique({
        where: { id: dateOptionId },
        include: { date_votes: true },
      })

      await prisma.eventDateOption.update({
        where: { id: dateOptionId },
        data: { votes: dateOption?.date_votes.length ?? 0 },
      })

      return NextResponse.json({
        success: true,
        action: 'added',
      })
    }
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { error: '投票処理に失敗しました' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id
    const body = await request.json()
    const { decidedDateOptionId } = body

    if (!decidedDateOptionId) {
      return NextResponse.json(
        { error: '決定する日程オプションIDが必要です' },
        { status: 400 }
      )
    }

    const dateOption = await prisma.eventDateOption.findUnique({
      where: { id: decidedDateOptionId },
    })

    if (!dateOption) {
      return NextResponse.json(
        { error: '日程オプションが見つかりません' },
        { status: 404 }
      )
    }

    await prisma.event.update({
      where: { id: eventId },
      data: {
        decided_date: dateOption.date,
        status: 'VENUE_SELECTION',
      },
    })

    return NextResponse.json({
      success: true,
      decidedDate: dateOption.date,
    })
  } catch (error) {
    console.error('Decide date error:', error)
    return NextResponse.json(
      { error: '日程決定に失敗しました' },
      { status: 500 }
    )
  }
}