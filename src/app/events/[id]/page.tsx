import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DateVotingSection from '@/components/DateVotingSection'
import VenueSelectionSection from '@/components/VenueSelectionSection'
import { CalendarIcon, UserGroupIcon, CurrencyYenIcon, MapPinIcon } from '@heroicons/react/24/outline'

interface Props {
  params: { id: string }
}

export default async function EventDetailPage({ params }: Props) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      date_options: {
        include: {
          date_votes: true
        },
        orderBy: { date: 'asc' }
      },
      participants: true,
      venue_options: true,
      notifications: {
        orderBy: { sent_at: 'desc' }
      }
    }
  })

  if (!event) {
    notFound()
  }

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
    <div className="max-w-6xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
            {getStatusText(event.status)}
          </span>
        </div>
        {event.description && (
          <p className="text-gray-600 text-lg">{event.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* メインコンテンツ */}
        <div className="lg:col-span-2 space-y-8">
          {/* 日程調整セクション */}
          {event.status === 'DATE_VOTING' && (
            <DateVotingSection 
              event={event} 
              dateOptions={event.date_options}
              participants={event.participants}
            />
          )}

          {/* 会場選択セクション */}
          {event.status === 'VENUE_SELECTION' && (
            <VenueSelectionSection 
              event={event}
              venueOptions={event.venue_options}
            />
          )}

          {/* 確定情報 */}
          {event.status === 'CONFIRMED' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🎉 イベント確定</h2>
              <div className="space-y-4">
                {event.decided_date && (
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">確定日時</p>
                      <p className="text-gray-600">
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
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">確定会場</p>
                      <p className="text-gray-600">{event.decided_venue}</p>
                      {event.decided_venue_url && (
                        <a 
                          href={event.decided_venue_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800 text-sm"
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

          {/* 通知履歴 */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📢 通知履歴</h2>
            {event.notifications.length === 0 ? (
              <p className="text-gray-500">通知履歴がありません</p>
            ) : (
              <div className="space-y-3">
                {event.notifications.map((notification) => (
                  <div key={notification.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-900">
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

        {/* サイドバー */}
        <div className="space-y-6">
          {/* イベント情報 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">イベント情報</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <UserGroupIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">参加者</p>
                  <p className="text-gray-600">{event.participants.length}名</p>
                </div>
              </div>
              {event.budget && (
                <div className="flex items-center gap-3">
                  <CurrencyYenIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">予算</p>
                    <p className="text-gray-600">¥{event.budget.toLocaleString()}/人</p>
                  </div>
                </div>
              )}
              {event.location_conditions && (
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">場所の条件</p>
                    <p className="text-gray-600">{event.location_conditions}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">作成日</p>
                  <p className="text-gray-600">
                    {new Date(event.created_at).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 参加者一覧 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">参加者一覧</h3>
            <div className="space-y-2">
              {event.participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">
                      {participant.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{participant.name}</p>
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