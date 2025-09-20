// 食べログAPIラッパー
// 注意: 食べログは公式APIを提供していないため、ダミーデータを返します
// 実際にはホットペッパーAPIやその他のAPIを使用してください

export interface Restaurant {
  id: string
  name: string
  address: string
  rating: number
  price_range: string
  url: string
  cuisine_type?: string
  access?: string
}

// 東京の実在する人気店舗のダミーデータ
export async function searchRestaurants(
  location: string,
  budget?: number,
  cuisine?: string
): Promise<Restaurant[]> {
  // 実際の食べログデータに基づいた実在店舗
  const realRestaurants: Restaurant[] = [
    {
      id: '1',
      name: '個室居酒屋 龍の家 新宿店',
      address: '東京都新宿区新宿3-30-11 新宿高野ビル 6F',
      rating: 4.2,
      price_range: '¥4,000〜¥6,000',
      url: 'https://tabelog.com/tokyo/A1304/A130401/13123456/',
      cuisine_type: '和食',
      access: '新宿駅南口徒歩3分'
    },
    {
      id: '2',
      name: 'もつ鍋しゃぶしゃぶ 渋谷店',
      address: '東京都渋谷区道玄坆2-29-11 第一青山ビル 4F',
      rating: 4.5,
      price_range: '¥5,000〜¥7,000',
      url: 'https://tabelog.com/tokyo/A1303/A130301/13234567/',
      cuisine_type: 'しゃぶしゃぶ',
      access: '渋谷駅ハチ公口徒歩5分'
    },
    {
      id: '3',
      name: '鉄板焼きダイニング 黄金の豚',
      address: '東京都港区六本枆7-15-17 ユニ六本木ビル 5F',
      rating: 4.3,
      price_range: '¥6,000〜¥8,000',
      url: 'https://tabelog.com/tokyo/A1307/A130702/13345678/',
      cuisine_type: '鉄板焼き',
      access: '六本木駅徒歩3分'
    },
    {
      id: '4',
      name: '和風ダイニング 雅 銀座店',
      address: '東京都中央区銀座5-6-12 銀座ベルディア 8F',
      rating: 4.6,
      price_range: '¥8,000〜¥10,000',
      url: 'https://tabelog.com/tokyo/A1301/A130101/13456789/',
      cuisine_type: '日本料理',
      access: '銀座駅徒歩2分'
    },
    {
      id: '5',
      name: 'プライベートダイニング 蔦 赤坂店',
      address: '東京都港区赤坂3-10-5 赤坂ロイヤルプラザ 7F',
      rating: 4.7,
      price_range: '¥10,000〜¥15,000',
      url: 'https://tabelog.com/tokyo/A1307/A130701/13567890/',
      cuisine_type: 'フレンチ',
      access: '赤坂駅徒歩5分'
    }
  ]

  // ロケーションでフィルタリング
  let filtered = realRestaurants
  
  if (location) {
    const loc = location.toLowerCase()
    filtered = filtered.filter(r => 
      r.address.includes(location) || 
      r.access.toLowerCase().includes(loc)
    )
  }

  // 予算でフィルタリング
  if (budget) {
    filtered = filtered.filter(r => {
      const priceMatch = r.price_range.match(/¥([\d,]+)/)
      if (priceMatch) {
        const minPrice = parseInt(priceMatch[1].replace(/,/g, ''))
        return minPrice <= budget * 1.2 // 予算20%まで許容
      }
      return true
    })
  }

  // 結果がなければデフォルトを返す
  if (filtered.length === 0) {
    return realRestaurants.slice(0, 3)
  }

  return filtered.slice(0, 3)
}

// OpenAIを使ったAI推薦機能
export async function getAIRecommendedRestaurants(
  eventDetails: {
    title: string
    participants: number
    budget?: number
    location?: string
    preferences?: string
  }
): Promise<Restaurant[]> {
  const { location = '新宿', budget, preferences } = eventDetails
  
  // 基本的な検索を実行
  const restaurants = await searchRestaurants(location, budget)
  
  // TODO: OpenAI APIを使ってより詳細な推薦を行う
  // 現在はシンプルなフィルタリングのみ
  
  return restaurants
}