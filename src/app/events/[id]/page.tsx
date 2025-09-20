'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, CalendarIcon, MapPinIcon, UserGroupIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface Event {
  id: string
  title: string
  description?: string
  budget?: number
  location_conditions?: string
  status: string
  decided_date?: string
  decided_venue?: string
  date_options: DateOption[]
  participants: Participant[]
  venue_options: VenueOption[]
}

interface DateOption {
  id: string
  date: string
  votes: number
  date_votes: { participant_slack_id: string }[]
}

interface Participant {
  id: string
  slack_id: string
  name: string
  email?: string
}

interface VenueOption {
  id: string
  name: string
  address?: string
  price_range?: string
  rating?: number
}

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id as string
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentParticipant, setCurrentParticipant] = useState<string>('')

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`)
      const data = await response.json()
      setEvent(data)
    } catch (error) {
      console.error('Failed to fetch event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (dateOptionId: string) => {
    if (!currentParticipant) {
      alert('参加者を選択してください')
      return
    }

    try {
      const response = await fetch(`/api/events/${eventId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateOptionId,
          participantSlackId: currentParticipant,
        }),
      })

      if (response.ok) {
        fetchEvent()
      }
    } catch (error) {
      console.error('Vote failed:', error)
      alert('投票に失敗しました')
    }
  }

  const handleDecideDate = async (dateOptionId: string) => {
    if (!confirm('この日程で決定しますか?')) return

    try {
      const response = await fetch(`/api/events/${eventId}/vote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decidedDateOptionId: dateOptionId }),
      })

      if (response.ok) {
        fetchEvent()
        alert('日程が決定しました！')
      }
    } catch (error) {
      console.error('Decide date failed:', error)
      alert('日程決定に失敗しました')
    }
  }

  const handleGenerateVenues = async () => {
    if (!confirm('AIに会場を提案させますか?')) return

    try {
      const response = await fetch(`/api/events/${eventId}/venues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        fetchEvent()
        alert('会場が提案されました！')
      }
    } catch (error) {
      console.error('Generate venues failed:', error)
      alert('会場提案に失敗しました')
    }
  }

  const handleDecideVenue = async (venueId: string, venueName: string) => {
    if (!confirm(`${venueName}で決定しますか?`)) return

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decided_venue: venueName,
          status: 'CONFIRMED',
        }),
      })

      if (response.ok) {
        fetchEvent()
        alert('会場が決定しました！')
      }
    } catch (error) {
      console.error('Decide venue failed:', error)
      alert('会場決定に失敗しました')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">イベントが見つかりません</p>
        <Link href="/" className="btn-primary mt-4 inline-block">
          ホームに戻る
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeftIcon className="w-5 h-5" />
        イベント一覧に戻る
      </Link>

      <div className="card mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
            <p className="text-gray-600">{event.description}</p>
          </div>
          <span className={`badge ${
            event.status === 'CONFIRMED' ? 'bg-green-500 text-white' :
            event.status === 'VENUE_SELECTION' ? 'bg-purple-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {event.status === 'DATE_VOTING' ? '日程調整中' :
             event.status === 'VENUE_SELECTION' ? '会場選び中' :
             event.status === 'CONFIRMED' ? '確定済み' : event.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <UserGroupIcon className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">参加者</p>
              <p className="font-bold">{event.participants.length}名</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <p className="text-sm text-gray-600">予算</p>
              <p className="font-bold">
                {event.budget ? `¥${event.budget.toLocaleString()}` : '未設定'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPinIcon className="w-6 h-6 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">会場条件</p>
              <p className="font-bold">{event.location_conditions || '未設定'}</p>
            </div>
          </div>
        </div>
      </div>

      {event.status === 'CONFIRMED' && (
        <div className="card mb-8 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold text-green-900">イベント確定</h2>
          </div>
          <div className="space-y-3">
            <p className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-green-600" />
              <span className="font-bold">日時:</span>
              {event.decided_date && new Date(event.decided_date).toLocaleString('ja-JP')}
            </p>
            <p className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-green-600" />
              <span className="font-bold">会場:</span>
              {event.decided_venue}
            </p>
          </div>
        </div>
      )}

      {event.status === 'DATE_VOTING' && (
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-6">日程調整</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">あなたの名前を選択</label>
            <select
              value={currentParticipant}
              onChange={(e) => setCurrentParticipant(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">選択してください</option>
              {event.participants.map((p) => (
                <option key={p.id} value={p.slack_id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {event.date_options.map((option) => {
              const hasVoted = currentParticipant && option.date_votes.some(
                (v) => v.participant_slack_id === currentParticipant
              )
              
              return (
                <div key={option.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg">
                        {new Date(option.date).toLocaleString('ja-JP', {
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-sm text-gray-600">{option.votes}票</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVote(option.id)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          hasVoted
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {hasVoted ? '投票済み' : '投票する'}
                      </button>
                      <button
                        onClick={() => handleDecideDate(option.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                      >
                        この日程に決定
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {event.status === 'VENUE_SELECTION' && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">会場選択</h2>
            {event.venue_options.length === 0 && (
              <button
                onClick={handleGenerateVenues}
                className="btn-primary inline-flex items-center gap-2"
              >
                <SparklesIcon className="w-5 h-5" />
                AI会場提案を生成
              </button>
            )}
          </div>

          {event.venue_options.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>まだ会場が提案されていません</p>
              <p className="text-sm">AIに会場を提案させましょう</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {event.venue_options.map((venue) => (
                <div key={venue.id} className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{venue.name}</h3>
                      {venue.address && (
                        <p className="text-gray-600 mb-1">
                          📍 {venue.address}
                        </p>
                      )}
                      {venue.price_range && (
                        <p className="text-gray-600 mb-1">
                          💰 {venue.price_range}
                        </p>
                      )}
                      {venue.rating && (
                        <p className="text-gray-600">
                          ⭐ {venue.rating}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDecideVenue(venue.id, venue.name)}
                      className="btn-primary"
                    >
                      この会場に決定
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="card mt-8">
        <h2 className="text-2xl font-bold mb-4">参加者一覧</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {event.participants.map((participant) => (
            <div key={participant.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {participant.name[0]}
              </div>
              <div>
                <p className="font-medium">{participant.name}</p>
                {participant.email && (
                  <p className="text-sm text-gray-600">{participant.email}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}