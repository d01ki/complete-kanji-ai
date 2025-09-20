import axios from 'axios'

export interface TabelogVenue {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  genre: string
  budget: string
  rating: number
  url: string
  imageUrl?: string
  tel?: string
  capacity?: string
}

// 食べログAPIの代わりにHotpepper APIを使用（無料で利用可能）
export async function searchVenues(
  keyword: string,
  lat?: number,
  lng?: number,
  budget?: number,
  range?: number
): Promise<TabelogVenue[]> {
  try {
    // Hotpepper Gourmet API
    const apiKey = process.env.HOTPEPPER_API_KEY
    if (!apiKey) {
      console.warn('HOTPEPPER_API_KEY not set, using mock data')
      return getMockVenues(keyword)
    }

    const params: any = {
      key: apiKey,
      keyword: keyword,
      format: 'json',
      count: 20,
    }

    if (lat && lng) {
      params.lat = lat
      params.lng = lng
      params.range = range || 3 // 1km範囲
    }

    if (budget) {
      // 予算に応じたコード設定
      if (budget < 3000) params.budget = 'B009' // ~3000円
      else if (budget < 5000) params.budget = 'B010' // 3000-5000円
      else params.budget = 'B011' // 5000円~
    }

    const response = await axios.get(
      'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/',
      { params }
    )

    if (response.data.results?.shop) {
      return response.data.results.shop.map((shop: any) => ({
        id: shop.id,
        name: shop.name,
        address: shop.address,
        lat: parseFloat(shop.lat),
        lng: parseFloat(shop.lng),
        genre: shop.genre?.name || '居酒屋',
        budget: shop.budget?.average || '不明',
        rating: parseFloat(shop.rating || '3.5'),
        url: shop.urls?.pc || '',
        imageUrl: shop.photo?.pc?.l || shop.photo?.mobile?.l,
        tel: shop.tel || '',
        capacity: shop.capacity ? `${shop.capacity}名` : '要確認',
      }))
    }

    return getMockVenues(keyword)
  } catch (error) {
    console.error('Venue search error:', error)
    return getMockVenues(keyword)
  }
}

// モックデータ（APIキーがない場合や開発用）
function getMockVenues(keyword: string): TabelogVenue[] {
  const mockVenues: TabelogVenue[] = [
    {
      id: '1',
      name: '魚民 渋谷センター街店',
      address: '東京都渋谷区宇田川町25-3',
      lat: 35.661777,
      lng: 139.698334,
      genre: '居酒屋',
      budget: '3,000円～4,000円',
      rating: 3.5,
      url: 'https://www.monteroza.co.jp/shop/uotami/',
      tel: '03-5784-3888',
      capacity: '100名',
    },
    {
      id: '2',
      name: '和民 新宿東口店',
      address: '東京都新宿区新宿3-34-16',
      lat: 35.691777,
      lng: 139.705334,
      genre: '居酒屋',
      budget: '2,500円～3,500円',
      rating: 3.3,
      url: 'https://www.watami.co.jp/',
      tel: '03-5312-4488',
      capacity: '80名',
    },
    {
      id: '3',
      name: '土間土間 池袋西口店',
      address: '東京都豊島区西池袋1-21-1',
      lat: 35.729777,
      lng: 139.710334,
      genre: '居酒屋',
      budget: '3,000円～4,000円',
      rating: 3.7,
      url: 'https://www.chimney.co.jp/dodoma/',
      tel: '03-5391-2233',
      capacity: '120名',
    },
    {
      id: '4',
      name: 'つぼ八 品川店',
      address: '東京都港区高輪3-25-27',
      lat: 35.628777,
      lng: 139.738334,
      genre: '居酒屋',
      budget: '3,500円～4,500円',
      rating: 3.4,
      url: 'https://www.tsubohachi.co.jp/',
      tel: '03-5421-1188',
      capacity: '60名',
    },
    {
      id: '5',
      name: 'さかなや道場 秋葉原店',
      address: '東京都千代田区外神田1-15-13',
      lat: 35.698777,
      lng: 139.773334,
      genre: '海鮮居酒屋',
      budget: '3,000円～4,000円',
      rating: 3.6,
      url: 'https://www.create-restaurants.co.jp/shop/sakanaya/',
      tel: '03-5295-3355',
      capacity: '90名',
    },
  ]

  // キーワードフィルタリング
  if (keyword) {
    return mockVenues.filter(
      (v) =>
        v.name.includes(keyword) ||
        v.address.includes(keyword) ||
        v.genre.includes(keyword)
    )
  }

  return mockVenues
}

// Google Places APIを使った検索（オプション）
export async function searchVenuesWithGoogle(
  query: string,
  location?: { lat: number; lng: number },
  radius: number = 1000
): Promise<TabelogVenue[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    return getMockVenues(query)
  }

  try {
    const params: any = {
      key: apiKey,
      query: `${query} 居酒屋`,
      type: 'restaurant',
    }

    if (location) {
      params.location = `${location.lat},${location.lng}`
      params.radius = radius
    }

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      { params }
    )

    if (response.data.results) {
      return response.data.results.slice(0, 10).map((place: any) => ({
        id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        genre: place.types?.[0] || '飲食店',
        budget: place.price_level ? `¥${place.price_level * 1000}程度` : '不明',
        rating: place.rating || 3.0,
        url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        imageUrl: place.photos?.[0]?.photo_reference
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
          : undefined,
      }))
    }

    return getMockVenues(query)
  } catch (error) {
    console.error('Google Places API error:', error)
    return getMockVenues(query)
  }
}