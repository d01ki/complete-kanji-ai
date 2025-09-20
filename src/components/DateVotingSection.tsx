'use client'

import { useState } from 'react'
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline'
import type { Event } from '@/lib/db'

interface Props {
  event: Event
  onUpdate: () => void
}

export default function DateVotingSection({ event, onUpdate }: Props) {
  const [loading, setLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleDecideDate = async () => {
    if (!selectedOption) {
      alert('日程を選択してください')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/events/${event.id}/decide-date`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateOptionId: selectedOption })
      })

      if (!response.ok) throw new Error('日程の決定に失敗しました')

      alert('日程が決定されました！次は会場選びに進みます。')
      onUpdate()
    } catch (error) {
      alert(error instanceof Error ? error.message : '予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <ClockIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">日程調整</h2>
      </div>

      <div className="space-y-3 mb-6">
        {event.date_options.map((option) => {
          const isSelected = selectedOption === option.id
          return (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              type="button"
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(option.date).toLocaleDateString('ja-JP', {
                      month: 'numeric',
                      day: 'numeric',
                      weekday: 'short',
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(option.date).toLocaleTimeString('ja-JP', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {option.votes} / {event.participants.length}票
                  </span>
                  {isSelected && (
                    <CheckIcon className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={handleDecideDate}
        disabled={!selectedOption || loading}
        type="button"
        className="btn-primary w-full"
      >
        {loading ? '決定中...' : 'この日程で決定して次へ'}
      </button>
    </div>
  )
}