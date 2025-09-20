import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface VenueSuggestion {
  name: string
  address: string
  priceRange: string
  capacity: string
  features: string[]
  reasoning: string
}

export async function generateVenueSuggestions(
  eventTitle: string,
  budget?: number,
  participantCount?: number,
  locationConditions?: string
): Promise<VenueSuggestion[]> {
  const prompt = `以下の条件に基づいて、適切な会場を5つ提案してください。

イベント名: ${eventTitle}
予算: ${budget ? `¥${budget.toLocaleString()}` : '未設定'}
参加者数: ${participantCount || '未定'}名
場所の条件: ${locationConditions || '特になし'}

各会場について以下の形式でJSONで返してください：
{
  "venues": [
    {
      "name": "会場名",
      "address": "住所",
      "priceRange": "予算範囲",
      "capacity": "収容人数",
      "features": ["特徴1", "特徴2", "特徴3"],
      "reasoning": "この会場を推薦する理由"
    }
  ]
}

実在する会場をベースに、具体的で実用的な提案をしてください。`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'あなたはイベント会場の専門家です。ユーザーの条件に基づいて最適な会場を提案します。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const data = JSON.parse(content)
    return data.venues || []
  } catch (error) {
    console.error('OpenAI API error:', error)
    return getDefaultVenueSuggestions()
  }
}

function getDefaultVenueSuggestions(): VenueSuggestion[] {
  return [
    {
      name: '都内レストラン A',
      address: '東京都渋谷区',
      priceRange: '¥3,000 - ¥5,000',
      capacity: '20-50名',
      features: ['個室あり', '飲み放題プラン', '駅近'],
      reasoning: '予算と人数に適した標準的な選択肢です',
    },
    {
      name: '居酒屋チェーン B',
      address: '東京都新宿区',
      priceRange: '¥2,500 - ¥4,000',
      capacity: '30-80名',
      features: ['大人数対応', 'コスパ良好', 'アクセス便利'],
      reasoning: 'コストパフォーマンスに優れています',
    },
    {
      name: 'ホテル宴会場 C',
      address: '東京都港区',
      priceRange: '¥5,000 - ¥8,000',
      capacity: '50-100名',
      features: ['高級感', '設備充実', 'サービス良好'],
      reasoning: '特別なイベントに最適です',
    },
  ]
}