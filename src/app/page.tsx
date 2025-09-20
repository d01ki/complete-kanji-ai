'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusIcon, CalendarIcon, MapPinIcon, UserGroupIcon, ClockIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline'
import type { Event } from '@/lib/db'

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
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

  return (
    <div>
      <div className="text-center mb-12">
        <div className="inline-block mb-6">
          <SparklesIcon className="w-20 h-20 text-blue-600 animate-float" />
        </div>
        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            イベント管理をもっと簡単に
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          AIが日程調整から会場提案まで自動化
        </p>
        <Link href="/events/create" className="btn-primary inline-flex items-center gap-3 text-lg">
          <PlusIcon className="w-6 h-6" />
          新規イベント作成
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-2">総イベント数</p>
              <p className="text-4xl font-bold">{events.length}</p>
            </div>
            <CalendarIcon className="w-12 h-12 text-blue-200" />
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-yellow-500 to-orange-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 mb-2">進行中</p>
              <p className="text-4xl font-bold">
                {events.filter(e => ['PLANNING', 'DATE_VOTING', 'VENUE_SELECTION'].includes(e.status)).length}
              </p>
            </div>
            <ClockIcon className="w-12 h-12 text-yellow-200" />
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 mb-2">確定済み</p>
              <p className="text-4xl font-bold">
                {events.filter(e => e.status === 'CONFIRMED').length}
              </p>
            </div>
            <CheckCircleIcon className="w-12 h-12 text-green-200" />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-3xl font-bold mb-8">イベント一覧</h2>
        
        {events.length === 0 ? (
          <div className="text-center py-16">
            <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-6">まだイベントがありません</p>
            <Link href="/events/create" className="btn-primary inline-flex items-center gap-2">
              <PlusIcon className="w-5 h-5" />
              最初のイベントを作成
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                      <span className={`badge ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                      </span>
                    </div>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                  <Link href={`/events/${event.id}`} className="btn-primary">
                    詳細を見る
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="w-5 h-5 text-blue-600" />
                    <span>{event.participants.length}名</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-green-600" />
                    <span>{event.decided_date ? '決定済み' : `${event.date_options.length}候補`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600 font-bold">¥</span>
                    <span>{event.budget ? `¥${event.budget.toLocaleString()}` : '未設定'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-orange-600" />
                    <span>{event.decided_venue || '未定'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}