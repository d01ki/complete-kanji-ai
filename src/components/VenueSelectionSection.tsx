'use client'

import { useState } from 'react'
import { MapPinIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

interface VenueOption {
  id: string
  name: string
  address?: string | null
  url?: string | null
  price_range?: string | null
  rating?: number | null
}

interface Props {
  event: any
  venueOptions: VenueOption[]
}

export default function VenueSelectionSection({ event, venueOptions }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null)

  const handleAIRecommendation = async () => {
    setAiLoading(true)
    try {
      const response = await fetch(`/api/events/${event.id}/ai-venues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) throw new Error('AI提案の取得に失敗しました')

      alert('AI会場提案を取得しました！')
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : '予期しないエラーが発生しました')
    } finally {
      setAiLoading(false)
    }
  }

  const handleDecideVenue = async () => {
    if (!selectedVenue) {
      alert('会場を選択してください')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/events/${event.id}/decide-venue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venueOptionId: selectedVenue })
      })

      if (!response.ok) throw new Error('会場の決定に失敗しました')

      alert('会場が決定されました！イベントが確定しました🎉')
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : '予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MapPinIcon className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">会場選択</h2>
          </div>
          <button
            onClick={handleAIRecommendation}
            disabled={aiLoading}
            className="btn-secondary flex items-center gap-2"
          >
            <SparklesIcon className="w-4 h-4" />
            {aiLoading ? 'AI提案中...' : 'AI会場提案'}
          </button>
        </div>

        {venueOptions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">まだ会場候補がありません</p>
            <p className="text-sm text-gray-400">AI会場提案ボタンで候補を取得できます</p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {venueOptions.map((venue) => {
              const isSelected = selectedVenue === venue.id
              return (
                <button
                  key={venue.id}
                  onClick={() => setSelectedVenue(venue.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{venue.name}</p>
                      {venue.address && (
                        <p className="text-sm text-gray-600 mt-1">{venue.address}</p>
                      )}
                      <div className="flex gap-3 mt-2">
                        {venue.price_range && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {venue.price_range}
                          </span>
                        )}
                        {venue.rating && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            ★ {venue.rating}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircleIcon className="w-5 h-5 text-purple-600 ml-3" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {venueOptions.length > 0 && (
          <button
            onClick={handleDecideVenue}
            disabled={!selectedVenue || loading}
            className="btn-primary w-full"
          >
            {loading ? '決定中...' : 'この会場で確定'}
          </button>
        )}
      </div>
    </div>
  )
}