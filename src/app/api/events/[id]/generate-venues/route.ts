import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage } from '@langchain/core/messages'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id

    // イベント情報を取得
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'イベントが見つかりません' },
        { status: 404 }
      )
    }

    if (event.status !== 'VENUE_SELECTION') {
      return NextResponse.json(
        { error: 'このイベントは会場選択段階ではありません' },
        { status: 400 }
      )
    }

    // OpenAI APIが設定されているかチェック
    if (!process.env.OPENAI_API_KEY) {
      // ダミーデータで代用
      const dummyVenues = [
        {
          name: '新宿 魚民',
          address: '東京都新宿区西新宿1-1-1',
          price_range: '2000円〜3000円',
          rating: 3.8,
          url: 'https://example.com/uotami-shinjuku'
        },
        {
          name: '渋谷 鳥貴族',
          address: '東京都渋谷区道玄坂1-2-3',
          price_range: '2500円〜3500円',
          rating: 4.1,
          url: 'https://example.com/torikizoku-shibuya'
        },
        {
          name: '新橋 白木屋',
          address: '東京都港区新橋2-3-4',
          price_range: '3000円〜4000円',
          rating: 3.9,
          url: 'https://example.com/shirokiya-shinbashi'
        }
      ]

      // ダミー会場をDBに保存
      for (const venue of dummyVenues) {
        await prisma.eventVenueOption.create({
          data: {
            event_id: eventId,
            name: venue.name,
            address: venue.address,
            price_range: venue.price_range,
            rating: venue.rating,
            url: venue.url,
          }
        })
      }

      return NextResponse.json({ message: '会場候補を生成しました（ダミーデータ）' })
    }

    // AI による会場提案
    const llm = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
    })

    const prompt = `
以下の条件でイベント会場を3つ提案してください：

イベント名: ${event.title}
予算: ${event.budget ? `${event.budget}円/人` : '指定なし'}
場所の条件: ${event.location_conditions || '指定なし'}

各会場について以下の情報をJSON形式で返してください：
{
  "venues": [
    {
      "name": "会場名",
      "address": "住所",
      "price_range": "価格帯（例：3000円〜4000円）",
      "rating": 4.2,
      "description": "会場の特徴"
    }
  ]
}

実在する会場を提案し、価格帯は予算に合わせてください。
`

    const response = await llm.invoke([new HumanMessage(prompt)])
    const aiResponse = response.content as string

    // JSON部分を抽出
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('AI応答からJSONを抽出できませんでした')
    }

    const venueData = JSON.parse(jsonMatch[0])

    // AI提案の会場をDBに保存
    for (const venue of venueData.venues) {
      await prisma.eventVenueOption.create({
        data: {
          event_id: eventId,
          name: venue.name,
          address: venue.address,
          price_range: venue.price_range,
          rating: venue.rating,
          // 食べログAPIの実装時にURLを設定
          url: null,
        }
      })
    }

    return NextResponse.json({ 
      message: 'AI会場提案を生成しました',
      venues: venueData.venues 
    })

  } catch (error) {
    console.error('AI venue generation failed:', error)
    return NextResponse.json(
      { error: 'AI会場提案の生成に失敗しました' },
      { status: 500 }
    )
  }
}