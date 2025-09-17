import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '完全幹事AI',
  description: '飲み会・イベントの幹事タスクを自動化するWebアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">🤖 完全幹事AI</h1>
              </div>
              <div className="text-sm text-gray-500">
                開発版
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}