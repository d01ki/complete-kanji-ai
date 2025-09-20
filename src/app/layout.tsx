import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { HomeIcon } from '@heroicons/react/24/outline'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '完全幹事AI',
  description: '飲み会・イベントの幹事タスクを自動化',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          {/* ヘッダー */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">🎉</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">完全幹事AI</h1>
                    <p className="text-xs text-gray-500">イベント幹事を楽に</p>
                  </div>
                </Link>
                
                <Link 
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  <HomeIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">ホーム</span>
                </Link>
              </div>
            </div>
          </header>

          {/* メインコンテンツ */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          {/* フッター */}
          <footer className="bg-white border-t border-gray-200 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <p className="text-center text-gray-500 text-sm">
                © 2025 完全幹事AI - Powered by AI
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}