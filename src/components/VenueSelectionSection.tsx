'use client'

import { useState } from 'react'
import { StarIcon, MapPinIcon, CurrencyYenIcon, LinkIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface VenueOption {
  id: string
  name: string
  address?: string
  url?: string
  price_range?: string
  rating?: number
  is_decided: boolean
}

interface Event {
  id: string
  title: string
  budget?: number
  location_conditions?: string
}

interface Props {
  event: Event
  venueOptions: VenueOption[]
}

export default function VenueSelectionSection({ event, venueOptions }: Props) {
  const [loading, setLoading] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)

  const generateAIVenues = async () => {
    setGeneratingAI(true)
    try {
      const response = await fetch(`/api/events/${event.id}/generate-venues`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('AI会場提案の生成に失敗しました')
      }

      // ページをリロード
      window.location.reload()
    } catch (error) {
      alert(error instanceof Error ? error.message : '予期しないエラーが発生しました')
    } finally {
      setGeneratingAI(false)
    }
  }

  const selectVenue = async (venueId: string) => {
    if (!confirm('この会場に決定しますか？')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/events/${event.id}/select-venue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ venueId }),
      })

      if (!response.ok) {
        throw new Error('会場選択に失敗しました')
      }

      // ページをリロード
      window.location.reload()
    } catch (error) {
      alert(error instanceof Error ? error.message : '予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null
    
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />)
    }
    
    if (hasHalfStar) {
      stars.push(<StarIcon key="half" className="w-4 h-4 text-yellow-400" />)
    }
    
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }
    
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-sm text-gray-600 ml-1">{rating}</span>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">🍽️ 会場選択</h2>
        <div className="flex gap-3">
          <button
            onClick={generateAIVenues}
            disabled={generatingAI}
            className="btn-secondary"
          >
            {generatingAI ? 'AI提案中...' : '🤖 AI会場提案'}
          </button>
        </div>
      </div>

      {/* 検索条件表示 */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg">
        <h3 className="font-medium text-purple-900 mb-2">検索条件</h3>
        <div className="text-sm text-purple-800 space-y-1">
          {event.budget && (
            <p>💰 予算: ¥{event.budget.toLocaleString()}/人</p>
          )}
          {event.location_conditions && (
            <p>📍 条件: {event.location_conditions}</p>
          )}
        </div>
      </div>

      {/* 会場候補一覧 */}
      {venueOptions.length === 0 ? (
        <div className="text-center py-12">
          <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">まだ会場候補がありません</p>
          <button
            onClick={generateAIVenues}
            disabled={generatingAI}
            className="btn-primary"
          >
            {generatingAI ? 'AI提案中...' : '🤖 AI会場提案を開始'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {venueOptions.map((venue) => (
            <div 
              key={venue.id}
              className={`border rounded-lg p-5 transition-all ${
                venue.is_decided 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {venue.name}
                    </h3>
                    {venue.is_decided && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        決定済み
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {venue.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{venue.address}</span>
                      </div>
                    )}
                    
                    {venue.price_range && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CurrencyYenIcon className="w-4 h-4" />
                        <span>{venue.price_range}</span>
                      </div>
                    )}
                    
                    {venue.rating && (
                      <div className="flex items-center gap-2">
                        {renderStars(venue.rating)}
                      </div>
                    )}
                    
                    {venue.url && (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-gray-500" />
                        <a 
                          href={venue.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800 text-sm"
                        >
                          詳細を見る →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-4">
                  {!venue.is_decided && (
                    <button
                      onClick={() => selectVenue(venue.id)}
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? '選択中...' : 'この会場に決定'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 操作ガイド */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">操作ガイド</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 🤖 AI会場提案ボタンで、条件に合った会場をAIが自動提案します</li>
          <li>• 各会場の「この会場に決定」ボタンで最終決定できます</li>
          <li>• 決定後はSlackで参加者に通知されます</li>
        </ul>
      </div>
    </div>
  )
}