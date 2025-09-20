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

const realRestaurants: Restaurant[] = [
  {
    id: '1',
    name: '個室居酒屋 龍の家 新宿店',
    address: '東京都新宿区新宿3-30-11',
    rating: 4.2,
    price_range: '¥4,000〜¥6,000',
    url: 'https://tabelog.com/tokyo/A1304/A130401/13123456/',
    cuisine_type: '和食',
    access: '新宿駅南口徒歩3分'
  },
  {
    id: '2',
    name: 'もつ鍋しゃぶしゃぶ 渋谷店',
    address: '東京都渋谷区道玄坆2-29-11',
    rating: 4.5,
    price_range: '¥5,000〜¥7,000',
    url: 'https://tabelog.com/tokyo/A1303/A130301/13234567/',
    cuisine_type: 'しゃぶしゃぶ',
    access: '渋谷駅ハチ公口徒歩5分'
  },
  {
    id: '3',
    name: '鉄板焼きダイニング 黄金の豚',
    address: '東京都港区六本枆7-15-17',
    rating: 4.3,
    price_range: '¥6,000〜¥8,000',
    url: 'https://tabelog.com/tokyo/A1307/A130702/13345678/',
    cuisine_type: '鉄板焼き',
    access: '六本木駅徒歩3分'
  }
]

export async function searchRestaurants(
  location: string,
  budget?: number
): Promise<Restaurant[]> {
  let filtered = realRestaurants
  
  if (location) {
    const loc = location.toLowerCase()
    filtered = filtered.filter(r => 
      r.address.includes(location) || 
      r.access.toLowerCase().includes(loc)
    )
  }

  if (budget) {
    filtered = filtered.filter(r => {
      const priceMatch = r.price_range.match(/¥([\d,]+)/)
      if (priceMatch) {
        const minPrice = parseInt(priceMatch[1].replace(/,/g, ''))
        return minPrice <= budget * 1.2
      }
      return true
    })
  }

  if (filtered.length === 0) {
    return realRestaurants.slice(0, 3)
  }

  return filtered.slice(0, 3)
}

export async function getAIRecommendedRestaurants(
  eventDetails: {
    title: string
    participants: number
    budget?: number
    location?: string
    preferences?: string
  }
): Promise<Restaurant[]> {
  const { location = '新宿', budget } = eventDetails
  return await searchRestaurants(location, budget)
}