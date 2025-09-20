import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateBillWithAgent } from '@/lib/ai-agent'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id
    const body = await request.json()
    const { totalAmount, numberOfPeople, customSplits } = body

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: '合計金額を入力してください' },
        { status: 400 }
      )
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        participants: {
          where: { is_attending: true },
        },
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'イベントが見つかりません' },
        { status: 404 }
      )
    }

    // 人数の決定（手動入力または参加者数）
    const actualPeople = numberOfPeople || event.participants.length

    // AIエージェントによる会計計算
    const billResult = await calculateBillWithAgent(
      totalAmount,
      actualPeople,
      customSplits ? 'カスタム割り勘定あり' : undefined
    )

    // イベントに合計金額を記録
    await prisma.event.update({
      where: { id: eventId },
      data: { total_bill: totalAmount },
    })

    // 割り勘定情報を保存
    if (customSplits && Array.isArray(customSplits)) {
      // カスタム割り勘定
      await Promise.all(
        customSplits.map((split: any) =>
          prisma.billSplit.upsert({
            where: { participant_id: split.participantId },
            create: {
              event_id: eventId,
              participant_id: split.participantId,
              amount: split.amount,
            },
            update: {
              amount: split.amount,
            },
          })
        )
      )
    } else {
      // 均等割り
      const perPerson = billResult.calculation?.perPerson || Math.ceil(totalAmount / actualPeople)
      
      await Promise.all(
        event.participants.map((participant) =>
          prisma.billSplit.upsert({
            where: { participant_id: participant.id },
            create: {
              event_id: eventId,
              participant_id: participant.id,
              amount: perPerson,
            },
            update: {
              amount: perPerson,
            },
          })
        )
      )
    }

    // 更新された割り勘定情報を取得
    const billSplits = await prisma.billSplit.findMany({
      where: { event_id: eventId },
      include: {
        participant: true,
      },
    })

    return NextResponse.json({
      success: true,
      calculation: billResult.calculation,
      explanation: billResult.explanation,
      splits: billSplits,
    })
  } catch (error) {
    console.error('Bill calculation error:', error)
    return NextResponse.json(
      { error: '会計計算に失敗しました' },
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

    const billSplits = await prisma.billSplit.findMany({
      where: { event_id: eventId },
      include: {
        participant: true,
      },
    })

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { total_bill: true },
    })

    return NextResponse.json({
      totalBill: event?.total_bill,
      splits: billSplits,
    })
  } catch (error) {
    console.error('Fetch bill error:', error)
    return NextResponse.json(
      { error: '会計情報の取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id
    const body = await request.json()
    const { participantId, isPaid } = body

    await prisma.billSplit.update({
      where: { participant_id: participantId },
      data: { is_paid: isPaid },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update payment status error:', error)
    return NextResponse.json(
      { error: '支払い状況の更新に失敗しました' },
      { status: 500 }
    )
  }
}