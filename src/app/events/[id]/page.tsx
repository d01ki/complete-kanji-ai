'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CalendarIcon, UserGroupIcon, CurrencyYenIcon, MapPinIcon } from '@heroicons/react/24/outline'
import DateVotingSection from '@/components/DateVotingSection'
import VenueSelectionSection from '@/components/VenueSelectionSection'
import type { Event } from '@/lib/db'

export default function EventDetailPage() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data)
      }
    } catch (error) {
      console.error('Failed to fetch event:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshEvent = () => {
    fetchEvent()
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PLANNING: '企画中',
      DATE_VOTING: '日程調整中',
      VENUE_SELECTION: '会場選び中',
      CONFIRMED: '確定済み',
      COMPLETED: '完了',
      CANCELLED: 'キャンセル'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      PLANNING: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white',
      DATE_VOTING: 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white',
      VENUE_SELECTION: 'bg-gradient-to-r from-purple-400 to-pink-400 text-white',
      CONFIRMED: 'bg-gradient-to-r from-green-400 to-emerald-400 text-white',
      COMPLETED: 'bg-gradient-to-r from-gray-400 to-slate-400 text-white',
      CANCELLED: 'bg-gradient-to-r from-red-400 to-rose-400 text-white'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin border-t-transparent absolute top-0"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">読み込み中...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-gray-500 mb-4 text-xl font-semibold">イベントが見つかりません</div>
        <a href="/" className="btn-primary">ホームに戻る</a>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {event.title}
          </h1>
          <span className={`badge ${getStatusColor(event.status)}`}>
            {getStatusText(event.status)}
          </span>
        </div>
        {event.description && (
          <p className="text-gray-600 text-lg">{event.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {event.status === 'DATE_VOTING' && (
            <DateVotingSection 
              event={event}
              onUpdate={refreshEvent}
            />
          )}

          {event.status === 'VENUE_SELECTION' && (
            <VenueSelectionSection 
              event={event}
              onUpdate={refreshEvent}
            />
          )}

          {event.status === 'CONFIRMED' && (
            <div className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">🎉 イベント確定</h2>
              <div className="space-y-6">
                {event.decided_date && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <CalendarIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">確定日時</p>
                      <p className="text-lg text-gray-600">
                        {new Date(event.decided_date).toLocaleString('ja-JP', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          weekday: 'long',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {event.decided_venue && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <MapPinIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">確定会場</p>
                      <p className="text-lg text-gray-600 mb-2">{event.decided_venue}</p>
                      {event.decided_venue_url && (
                        <a 
                          href={event.decided_venue_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          詳細を見る →
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">📢 通知履歴</h2>
            {event.notifications.length === 0 ? (
              <p className="text-gray-500">通知履歴がありません</p>
            ) : (
              <div className="space-y-3">
                {event.notifications.map((notification) => (
                  <div key={notification.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {notification.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.sent_at).toLocaleString('ja-JP')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">イベント情報</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <UserGroupIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">参加者</p>
                  <p className="font-semibold text-gray-900">{event.participants.length}名</p>
                </div>
              </div>
              {event.budget && (
                <div className="flex items-center gap-3">
                  <CurrencyYenIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">予算</p>
                    <p className="font-semibold text-gray-900">¥{event.budget.toLocaleString()}/人</p>
                  </div>
                </div>
              )}
              {event.location_conditions && (
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">場所の条件</p>
                    <p className="font-semibold text-gray-900">{event.location_conditions}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">作成日</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(event.created_at).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">参加者一覧</h3>
            <div className="space-y-3">
              {event.participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {participant.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{participant.name}</p>
                    <p className="text-xs text-gray-500">{participant.slack_id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}