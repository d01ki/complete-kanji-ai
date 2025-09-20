import { openai } from '@ai-sdk/openai'
import { generateText, streamText, tool } from 'ai'
import { z } from 'zod'
import { searchVenues, searchVenuesWithGoogle } from './tabelog-api'

// AIエージェント用のツール定義
const venueSearchTool = tool({
  description: '条件に基づいて飲食店を検索します',
  parameters: z.object({
    query: z.string().describe('検索キーワード（例：渋谷 居酒屋）'),
    budget: z.number().optional().describe('一人あたりの予算（円）'),
    participantCount: z.number().optional().describe('参加人数'),
  }),
  execute: async ({ query, budget, participantCount }) => {
    const venues = await searchVenues(query, undefined, undefined, budget)
    return {
      venues: venues.slice(0, 5),
      message: `${venues.length}件の飲食店が見つかりました`,
    }
  },
})

const calculateBudgetTool = tool({
  description: '会計金額を計算します',
  parameters: z.object({
    totalAmount: z.number().describe('合計金額'),
    numberOfPeople: z.number().describe('人数'),
    includeOrganizer: z.boolean().optional().describe('幹事も含めるか'),
  }),
  execute: async ({ totalAmount, numberOfPeople, includeOrganizer = true }) => {
    const actualCount = includeOrganizer ? numberOfPeople : numberOfPeople - 1
    const perPerson = Math.ceil(totalAmount / actualCount)
    const remainder = totalAmount % actualCount
    
    return {
      perPerson,
      totalAmount,
      numberOfPeople: actualCount,
      remainder,
      message: `一人あたり ${perPerson.toLocaleString()}円（${remainder > 0 ? `余り${remainder}円` : '割り切れます'}）`,
    }
  },
})

export interface VenueRecommendation {
  venues: Array<{
    name: string
    address: string
    budget: string
    rating: number
    url: string
    reason: string
  }>
  reasoning: string
}

// AIエージェントによる会場推薦
export async function recommendVenuesWithAgent(
  eventTitle: string,
  budget?: number,
  participantCount?: number,
  locationConditions?: string
): Promise<VenueRecommendation> {
  try {
    const prompt = `あなたはイベント会場選びの専門家です。以下の条件で最適な飲食店を5つ推薦してください。

【イベント情報】
- タイトル: ${eventTitle}
- 予算: ${budget ? `一人あたり${budget.toLocaleString()}円` : '未設定'}
- 参加人数: ${participantCount || '未定'}名
- 場所の条件: ${locationConditions || '特になし'}

【要件】
1. 実在する飲食店を推薦すること
2. 予算と人数に見合った店舗を選ぶこと
3. アクセスの良い場所を優先すること
4. 各店舗について推薦理由を明記すること

まず、適切な検索キーワードで飲食店を検索し、その結果から最適な店舗を選んで推薦してください。`

    const result = await generateText({
      model: openai('gpt-4-turbo'),
      tools: {
        searchVenues: venueSearchTool,
      },
      maxSteps: 5,
      prompt,
    })

    // ツールの実行結果から会場情報を抽出
    const toolResults = result.toolResults || []
    const venuesFromTools = toolResults
      .filter((r: any) => r.toolName === 'searchVenues')
      .flatMap((r: any) => r.result?.venues || [])

    if (venuesFromTools.length > 0) {
      return {
        venues: venuesFromTools.slice(0, 5).map((v: any) => ({
          name: v.name,
          address: v.address,
          budget: v.budget,
          rating: v.rating,
          url: v.url,
          reason: `予算と条件に適した${v.genre}です`,
        })),
        reasoning: result.text,
      }
    }

    // フォールバック：直接検索
    const searchQuery = locationConditions || '渋谷 居酒屋'
    const venues = await searchVenues(searchQuery, undefined, undefined, budget)
    
    return {
      venues: venues.slice(0, 5).map((v) => ({
        name: v.name,
        address: v.address,
        budget: v.budget,
        rating: v.rating,
        url: v.url,
        reason: `${v.genre}で、予算と人数に適しています`,
      })),
      reasoning: '条件に基づいて実在する飲食店を選定しました。',
    }
  } catch (error) {
    console.error('AI venue recommendation error:', error)
    
    // エラー時のフォールバック
    const searchQuery = locationConditions || '渋谷 居酒屋'
    const venues = await searchVenues(searchQuery, undefined, undefined, budget)
    
    return {
      venues: venues.slice(0, 5).map((v) => ({
        name: v.name,
        address: v.address,
        budget: v.budget,
        rating: v.rating,
        url: v.url,
        reason: `実在する${v.genre}です`,
      })),
      reasoning: 'エラーが発生したため、基本的な検索結果を返しています。',
    }
  }
}

// 会計計算エージェント
export async function calculateBillWithAgent(
  totalAmount: number,
  numberOfPeople: number,
  customMessage?: string
) {
  try {
    const prompt = `会計の計算をしてください。

- 合計金額: ${totalAmount.toLocaleString()}円
- 人数: ${numberOfPeople}名
${customMessage ? `- 備考: ${customMessage}` : ''}

一人あたりの金額を計算し、分かりやすく説明してください。`

    const result = await generateText({
      model: openai('gpt-4-turbo'),
      tools: {
        calculateBudget: calculateBudgetTool,
      },
      prompt,
    })

    return {
      calculation: result.toolResults?.[0]?.result || null,
      explanation: result.text,
    }
  } catch (error) {
    console.error('Bill calculation error:', error)
    
    const perPerson = Math.ceil(totalAmount / numberOfPeople)
    return {
      calculation: {
        perPerson,
        totalAmount,
        numberOfPeople,
        message: `一人あたり ${perPerson.toLocaleString()}円`,
      },
      explanation: `合計${totalAmount.toLocaleString()}円を${numberOfPeople}名で割ると、一人あたり${perPerson.toLocaleString()}円です。`,
    }
  }
}