import Link from 'next/link'
import { PlusIcon, CalendarIcon, MapPinIcon, UserGroupIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

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
      { name: '鈴木', slack_id: '@suzuki' },
      { name: '山田', slack_id: '@yamada' }
    ],
    date_options: [
      { date: '2025-01-15 19:00', votes: 3 },
      { date: '2025-01-16 19:00', votes: 1 }
    ],
    created_at: '2024-12-20T10:00:00Z',
    budget: 5000,
    location_conditions: '新宿駅周辺、個室あり'
  },
  {
    id: '2',
    title: '歓送迎会',
    description: '新メンバー歓迎会',
    status: 'VENUE_SELECTION',
    participants: [
      { name: '山田', slack_id: '@yamada' },
      { name: '高橋', slack_id: '@takahashi' },
      { name: '伊藤', slack_id: '@ito' }
    ],
    date_options: [
      { date: '2025-02-10 18:30', votes: 3 }
    ],
    created_at: '2024-12-18T14:00:00Z',
    budget: 4000,
    decided_date: '2025-02-10 18:30'
  },
  {
    id: '3',
    title: 'プロジェクト打ち上げ',
    description: 'Q4プロジェクト成功祝い',
    status: 'CONFIRMED',
    participants: [
      { name: '佐藤', slack_id: '@sato' },
      { name: '田中', slack_id: '@tanaka' }
    ],
    date_options: [
      { date: '2025-01-20 19:00', votes: 2 }
    ],
    created_at: '2024-12-15T09:00:00Z',
    budget: 6000,
    decided_date: '2025-01-20 19:00',
    decided_venue: '新宿 個室居酒屋 龍'
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
      PLANNING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      DATE_VOTING: 'bg-blue-100 text-blue-800 border-blue-200',
      VENUE_SELECTION: 'bg-purple-100 text-purple-800 border-purple-200',
      CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
      COMPLETED: 'bg-gray-100 text-gray-800 border-gray-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200'
    }
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'DATE_VOTING': return <ClockIcon className="w-4 h-4" />
      case 'VENUE_SELECTION': return <MapPinIcon className="w-4 h-4" />
      case 'CONFIRMED': return <CheckCircleIcon className="w-4 h-4" />
      default: return <CalendarIcon className="w-4 h-4" />
    }
  }

  const getNextAction = (event: any) => {
    switch(event.status) {
      case 'DATE_VOTING': return '投票を集計して日程決定'
      case 'VENUE_SELECTION': return 'AI会場提案で場所を決定'
      case 'CONFIRMED': return '参加者に最終通知'
      default: return '詳細を確認'
    }
  }

  return (
    <div>
      {/* ヘッダー */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ダッシュボード</h1>
          <p className="text-gray-600 text-lg">イベントの管理・作成ができます</p>
        </div>
        <Link href="/events/create" className="btn-primary flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold">
          <PlusIcon className="w-6 h-6" />
          新規イベント作成
        </Link>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-full">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-800">総イベント数</p>
              <p className="text-3xl font-bold text-blue-900">{dummyEvents.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500 rounded-full">
              <ClockIcon className="w-8 h-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-800">進行中</p>
              <p className="text-3xl font-bold text-yellow-900">
                {dummyEvents.filter(e => ['PLANNING', 'DATE_VOTING', 'VENUE_SELECTION'].includes(e.status)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-full">
              <CheckCircleIcon className="w-8 h-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-800">確定済み</p>
              <p className="text-3xl font-bold text-green-900">
                {dummyEvents.filter(e => e.status === 'CONFIRMED').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* イベント一覧 */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">最近のイベント</h2>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm">すべて表示</button>
            <button className="btn-secondary text-sm">進行中のみ</button>
          </div>
        </div>
        
        <div className="grid gap-6">
          {dummyEvents.map((event) => (
            <div key={event.id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-primary-200 hover:shadow-lg transition-all duration-200">
              {/* イベントヘッダー */}
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {event.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(event.status)} flex items-center gap-1`}>
                      {getStatusIcon(event.status)}
                      {getStatusText(event.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                </div>
                <div className="flex gap-2 mt-4 lg:mt-0">
                  <Link 
                    href={`/events/${event.id}`}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    詳細・操作
                  </Link>
                </div>
              </div>

              {/* イベント詳細情報 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserGroupIcon className="w-4 h-4" />
                  <span className="font-medium">{event.participants.length}名参加</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarIcon className="w-4 h-4" />
                  {event.decided_date ? (
                    <span className="font-medium text-green-600">
                      {new Date(event.decided_date).toLocaleDateString('ja-JP', {
                        month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  ) : (
                    <span>{event.date_options.length}件候補</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-bold text-green-600">¥</span>
                  <span className="font-medium">¥{event.budget?.toLocaleString()}/人</span>
                </div>
                
                {event.decided_venue ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="font-medium text-green-600">{event.decided_venue}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{event.location_conditions || '場所未定'}</span>
                  </div>
                )}
              </div>

              {/* 次のアクション */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  次のステップ: <span className="font-medium text-gray-700">{getNextAction(event)}</span>
                </span>
                <span className="text-xs text-gray-400">
                  作成: {new Date(event.created_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}