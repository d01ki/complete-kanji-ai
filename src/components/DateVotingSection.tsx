'use client'

import { useState } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface DateOption {
  id: string
  date: Date
  votes: number
  date_votes: any[]
}

interface Participant {
  id: string
  slack_id: string
  name: string
}

interface Event {
  id: string
  title: string
  status: string
}

interface Props {
  event: Event
  dateOptions: DateOption[]
  participants: Participant[]
}

export default function DateVotingSection({ event, dateOptions, participants }: Props) {
  const [loading, setLoading] = useState(false)

  const finalizeDateVoting = async () => {
    if (!confirm('日程投票を終了して、最も票数の多い日程に決定しますか？')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/events/${event.id}/finalize-date`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('日程決定に失敗しました')
      }

      // ページをリロード（実際のプロジェクトではRouter.refresh()など使用）
      window.location.reload()
    } catch (error) {
      alert(error instanceof Error ? error.message : '予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const getMostVotedOption = () => {
    return dateOptions.reduce((max, option) => 
      option.votes > max.votes ? option : max
    , dateOptions[0])
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">🗳️ 日程調整</h2>
        <button
          onClick={finalizeDateVoting}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? '処理中...' : '投票終了 & 日程決定'}
        </button>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800 text-sm">
          📢 参加者はSlackまたはこのページで日程に投票できます。<br/>
          「投票終了 & 日程決定」ボタンで最も票数の多い日程が自動選択されます。
        </p>
      </div>

      <div className="space-y-4">
        {dateOptions.map((option) => {
          const isTopChoice = option.id === getMostVotedOption()?.id
          return (
            <div 
              key={option.id} 
              className={`border rounded-lg p-4 transition-all ${
                isTopChoice 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {formatDate(option.date)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {option.votes}票 / {participants.length}名
                    </p>
                  </div>
                  {isTopChoice && option.votes > 0 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">最多票</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* 投票プログレスバー */}
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        isTopChoice ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ 
                        width: `${participants.length > 0 ? (option.votes / participants.length) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 min-w-[3rem]">
                    {participants.length > 0 ? Math.round((option.votes / participants.length) * 100) : 0}%
                  </span>
                </div>
              </div>
              
              {/* 投票者一覧 */}
              {option.date_votes.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">投票済み:</p>
                  <div className="flex flex-wrap gap-1">
                    {option.date_votes.map((vote: any, index: number) => {
                      const participant = participants.find(p => p.slack_id === vote.participant_slack_id)
                      return (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                        >
                          {participant?.name || vote.participant_slack_id}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 投票統計 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">投票状況</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">総参加者数:</span>
            <span className="ml-2 font-medium">{participants.length}名</span>
          </div>
          <div>
            <span className="text-gray-600">最多票数:</span>
            <span className="ml-2 font-medium">{getMostVotedOption()?.votes || 0}票</span>
          </div>
        </div>
      </div>
    </div>
  )
}