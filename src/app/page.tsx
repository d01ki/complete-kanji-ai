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

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'DATE_VOTING': return <ClockIcon className="w-4 h-4" />
      case 'VENUE_SELECTION': return <MapPinIcon className="w-4 h-4" />
      case 'CONFIRMED': return <CheckCircleIcon className="w-4 h-4" />
      default: return <CalendarIcon className="w-4 h-4" />
    }
  }

  const getNextAction = (event: Event) => {
    switch(event.status) {
      case 'DATE_VOTING': return '投票を集計して日程決定'
      case 'VENUE_SELECTION': return 'AI会場提案で場所を決定'
      case 'CONFIRMED': return '参加者に最終通知'
      default: return '詳細を確認'
    }
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
      {/* ヒーローセクション */}
      <div className="text-center mb-12">
        <div className="inline-block mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <SparklesIcon className="relative w-20 h-20 text-blue-600 animate-float" />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            イベント管理を
          </span>
          <br />
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            もっと簡単に
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          AIが日程調整から会場提案まで自動化。
          <br />幹事の負担を90%削減します。
        </p>
        <Link href="/events/create" className="btn-primary inline-flex items-center gap-3 text-lg pulse-glow">
          <PlusIcon className="w-6 h-6" />
          新規イベント作成
        </Link>
      </div>

      {/* 統計カード */}
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

      {/* イベント一覧 */}
      <div className="card">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            イベント一覧
          </h2>
        </div>
        
        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-4">
              <CalendarIcon className="w-16 h-16 text-blue-500" />
            </div>
            <p className="text-gray-600 text-lg mb-6">まだイベントがありません</p>
            <Link href="/events/create" className="btn-primary inline-flex items-center gap-2">
              <PlusIcon className="w-5 h-5" />
              最初のイベントを作成
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <div key={event.id} className="group relative bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                        <span className={`badge ${getStatusColor(event.status)} flex items-center gap-1`}>
                          {getStatusIcon(event.status)}
                          {getStatusText(event.status)}
                        </span>
                      </div>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                    <Link 
                      href={`/events/${event.id}`}
                      className="btn-primary mt-4 lg:mt-0 inline-flex items-center gap-2"
                    >
                      詳細を見る
                      <SparklesIcon className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <UserGroupIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">参加者</p>
                        <p className="font-bold text-gray-900">{event.participants.length}名</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">日程</p>
                        <p className="font-bold text-gray-900">
                          {event.decided_date ? '決定済み' : `${event.date_options.length}候補`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <span className="text-purple-600 font-bold text-lg">¥</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">予算</p>
                        <p className="font-bold text-gray-900">
                          {event.budget ? `¥${event.budget.toLocaleString()}` : '未設定'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <MapPinIcon className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">会場</p>
                        <p className="font-bold text-gray-900">
                          {event.decided_venue ? '決定済み' : '未定'}
                        </p>
                      </div>
                    </div>
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