import Link from 'next/link'
import { PlusIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline'

// ダミーデータ
const dummyEvents = [
  {
    id: '1',
    title: '新年会2025',
    description: 'チーム新年会を開催します',
    status: 'DATE_VOTING',
    participants: [
      { name: '田中', slack_id: '@tanaka' },
      { name: '佐藤', slack_id: '@sato' },
      { name: '鈴木', slack_id: '@suzuki' }
    ],
    date_options: [
      { date: '2025-01-15 19:00' },
      { date: '2025-01-16 19:00' }
    ],
    created_at: '2024-12-20T10:00:00Z',
    budget: 5000
  },
  {
    id: '2',
    title: '歓送迎会',
    description: '新メンバー歓迎会',
    status: 'VENUE_SELECTION',
    participants: [
      { name: '山田', slack_id: '@yamada' },
      { name: '高橋', slack_id: '@takahashi' }
    ],
    date_options: [
      { date: '2025-02-10 18:30' }
    ],
    created_at: '2024-12-18T14:00:00Z',
    budget: 4000
  }
]

export default function HomePage() {
  const getStatusText = (status: string) => {
    const statusMap = {
      PLANNING: '企画中',
      DATE_VOTING: '日程調整中',
      VENUE_SELECTION: '会場選び中',
      CONFIRMED: '確定済み',
      COMPLETED: '完了',
      CANCELLED: 'キャンセル'
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap = {
      PLANNING: 'bg-yellow-100 text-yellow-800',
      DATE_VOTING: 'bg-blue-100 text-blue-800',
      VENUE_SELECTION: 'bg-purple-100 text-purple-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800'
    }
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div>
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-gray-600 mt-2">イベントの管理・作成ができます</p>
        </div>
        <Link href="/events/create" className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          新規イベント作成
        </Link>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <CalendarIcon className="w-8 h-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総イベント数</p>
              <p className="text-2xl font-bold text-gray-900">{dummyEvents.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <MapPinIcon className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">進行中</p>
              <p className="text-2xl font-bold text-gray-900">
                {dummyEvents.filter(e => ['PLANNING', 'DATE_VOTING', 'VENUE_SELECTION'].includes(e.status)).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">✓</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">完了</p>
              <p className="text-2xl font-bold text-gray-900">
                {dummyEvents.filter(e => e.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* イベント一覧 */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">最近のイベント</h2>
        <div className="space-y-4">
          {dummyEvents.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      <Link href={`/events/${event.id}`} className="hover:text-primary-600">
                        {event.title}
                      </Link>
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {getStatusText(event.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>参加者: {event.participants.length}名</span>
                    <span>日程候補: {event.date_options.length}件</span>
                    <span>予算: ¥{event.budget?.toLocaleString()}/人</span>
                    <span>作成: {new Date(event.created_at).toLocaleDateString('ja-JP')}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <Link 
                    href={`/events/${event.id}`}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    詳細 →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}