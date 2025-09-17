import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PlusIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default async function HomePage() {
  // 最新のイベント一覧を取得
  const events = await prisma.event.findMany({
    orderBy: { created_at: 'desc' },
    take: 10,
    include: {
      participants: true,
      date_options: true,
    }
  })

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
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <MapPinIcon className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">進行中</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => ['PLANNING', 'DATE_VOTING', 'VENUE_SELECTION'].includes(e.status)).length}
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
                {events.filter(e => e.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* イベント一覧 */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">最近のイベント</h2>
        {events.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">まだイベントがありません</p>
            <Link href="/events/create" className="btn-primary">
              最初のイベントを作成
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
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
        )}
      </div>
    </div>
  )
}