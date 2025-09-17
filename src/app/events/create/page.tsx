'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface DateOption {
  date: string
  time: string
}

interface Participant {
  slackId: string
  name: string
  email: string
}

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // フォーム状態
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [locationConditions, setLocationConditions] = useState('')
  
  const [dateOptions, setDateOptions] = useState<DateOption[]>([
    { date: '', time: '' }
  ])
  
  const [participants, setParticipants] = useState<Participant[]>([
    { slackId: '', name: '', email: '' }
  ])

  const addDateOption = () => {
    setDateOptions([...dateOptions, { date: '', time: '' }])
  }

  const removeDateOption = (index: number) => {
    if (dateOptions.length > 1) {
      setDateOptions(dateOptions.filter((_, i) => i !== index))
    }
  }

  const updateDateOption = (index: number, field: 'date' | 'time', value: string) => {
    const updated = [...dateOptions]
    updated[index][field] = value
    setDateOptions(updated)
  }

  const addParticipant = () => {
    setParticipants([...participants, { slackId: '', name: '', email: '' }])
  }

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index))
    }
  }

  const updateParticipant = (index: number, field: 'slackId' | 'name' | 'email', value: string) => {
    const updated = [...participants]
    updated[index][field] = value
    setParticipants(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 有効な日程候補のみフィルタ
      const validDateOptions = dateOptions.filter(opt => opt.date && opt.time)
      // 有効な参加者のみフィルタ
      const validParticipants = participants.filter(p => p.slackId && p.name)

      if (validDateOptions.length === 0) {
        alert('日程候補を最低1つ入力してください')
        return
      }

      if (validParticipants.length === 0) {
        alert('参加者を最低1人入力してください')
        return
      }

      // TODO: 実際のAPI呼び出しの代わりにダミー処理
      console.log('イベント作成データ:', {
        title,
        description,
        budget: budget ? parseInt(budget) : null,
        locationConditions,
        dateOptions: validDateOptions,
        participants: validParticipants,
      })

      // ダミーレスポンス
      const dummyEventId = 'event-' + Date.now()
      
      alert('イベントが作成されました！（ダミー実装）')
      router.push(`/events/${dummyEventId}`)
    } catch (error) {
      alert(error instanceof Error ? error.message : '予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">新規イベント作成</h1>
        <p className="text-gray-600 mt-2">イベントの詳細情報を入力してください</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本情報 */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">基本情報</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                イベント名 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="例: 新年会2025"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                説明
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                rows={3}
                placeholder="イベントの詳細や注意事項など"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  予算（1人あたり・円）
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="input-field"
                  placeholder="例: 5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  場所の条件
                </label>
                <input
                  type="text"
                  value={locationConditions}
                  onChange={(e) => setLocationConditions(e.target.value)}
                  className="input-field"
                  placeholder="例: 新宿駅周辺、個室あり"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 日程候補 */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">日程候補</h2>
            <button
              type="button"
              onClick={addDateOption}
              className="btn-secondary flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              候補追加
            </button>
          </div>
          <div className="space-y-3">
            {dateOptions.map((option, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="date"
                  value={option.date}
                  onChange={(e) => updateDateOption(index, 'date', e.target.value)}
                  className="input-field flex-1"
                />
                <input
                  type="time"
                  value={option.time}
                  onChange={(e) => updateDateOption(index, 'time', e.target.value)}
                  className="input-field flex-1"
                />
                {dateOptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDateOption(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 参加者 */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">参加者</h2>
            <button
              type="button"
              onClick={addParticipant}
              className="btn-secondary flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              参加者追加
            </button>
          </div>
          <div className="space-y-3">
            {participants.map((participant, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <input
                  type="text"
                  value={participant.slackId}
                  onChange={(e) => updateParticipant(index, 'slackId', e.target.value)}
                  className="input-field"
                  placeholder="Slack ID (@user)"
                />
                <input
                  type="text"
                  value={participant.name}
                  onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                  className="input-field"
                  placeholder="表示名"
                />
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={participant.email}
                    onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                    className="input-field flex-1"
                    placeholder="メールアドレス（任意）"
                  />
                  {participants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
            disabled={loading}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !title}
          >
            {loading ? '作成中...' : 'イベント作成（ダミー）'}
          </button>
        </div>
      </form>
    </div>
  )
}