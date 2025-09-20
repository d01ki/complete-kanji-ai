'use client'

import { useState, useEffect } from 'react'
import { CalculatorIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

interface Participant {
  id: string
  name: string
  is_attending: boolean
}

interface BillSplit {
  id: string
  participant_id: string
  amount: number
  is_paid: boolean
  participant: Participant
}

interface BillCalculatorProps {
  eventId: string
  participants: Participant[]
  totalBill?: number
}

export default function BillCalculator({ eventId, participants, totalBill }: BillCalculatorProps) {
  const [amount, setAmount] = useState(totalBill?.toString() || '')
  const [numberOfPeople, setNumberOfPeople] = useState(participants.filter(p => p.is_attending).length)
  const [customMode, setCustomMode] = useState(false)
  const [splits, setSplits] = useState<BillSplit[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (totalBill) {
      fetchBillSplits()
    }
  }, [totalBill])

  const fetchBillSplits = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/bill`)
      const data = await response.json()
      if (data.splits) {
        setSplits(data.splits)
      }
    } catch (error) {
      console.error('Failed to fetch bill splits:', error)
    }
  }

  const calculateBill = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('有効な金額を入力してください')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/events/${eventId}/bill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalAmount: parseFloat(amount),
          numberOfPeople,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setSplits(data.splits)
        alert(data.explanation || '会計を計算しました')
      }
    } catch (error) {
      console.error('Bill calculation failed:', error)
      alert('会計計算に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const togglePaidStatus = async (participantId: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/events/${eventId}/bill`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId,
          isPaid: !currentStatus,
        }),
      })

      setSplits(splits.map(s => 
        s.participant_id === participantId 
          ? { ...s, is_paid: !currentStatus }
          : s
      ))
    } catch (error) {
      console.error('Failed to update payment status:', error)
    }
  }

  const perPerson = amount && numberOfPeople > 0 
    ? Math.ceil(parseFloat(amount) / numberOfPeople)
    : 0

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <CalculatorIcon className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold">会計計算</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">合計金額</label>
          <div className="flex items-center gap-2">
            <span className="text-2xl">¥</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="15000"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            人数 <span className="text-gray-500">(欠席者がいる場合は調整してください)</span>
          </label>
          <input
            type="number"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 0)}
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {perPerson > 0 && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <p className="text-gray-700 mb-2">一人あたり</p>
            <p className="text-4xl font-bold text-blue-600">¥{perPerson.toLocaleString()}</p>
          </div>
        )}

        <button
          onClick={calculateBill}
          disabled={loading}
          className="btn-primary w-full py-4 text-lg"
        >
          {loading ? '計算中...' : '会計を計算'}
        </button>

        {splits.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-4">支払い状況</h3>
            <div className="space-y-2">
              {splits.map((split) => (
                <div
                  key={split.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => togglePaidStatus(split.participant_id, split.is_paid)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        split.is_paid ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      {split.is_paid && (
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <span className="font-medium">{split.participant.name}</span>
                  </div>
                  <span className="text-lg font-bold">¥{split.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}