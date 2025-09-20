import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { HomeIcon, SparklesIcon } from '@heroicons/react/24/outline'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '完全幹事AI - イベント運営を自動化',
  description: '飲み会・イベントの幹事タスクをAIが完全自動化。日程調整から会場提案まで。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen gradient-bg">
          {/* ヘッダー - グラスモーフィズムデザイン */}
          <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200/50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-3 hover:opacity-90 transition-all duration-300">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                      <SparklesIcon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      完全幹事AI
                    </h1>
                    <p className="text-xs text-gray-500 font-medium">AI Powered Event Manager</p>
                  </div>
                </Link>
                
                <Link 
                  href="/"
                  className="group flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-blue-600 bg-gray-100/50 hover:bg-blue-50 rounded-xl transition-all duration-300 font-medium"
                >
                  <HomeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">ホーム</span>
                </Link>
              </div>
            </div>
          </header>

          {/* メインコンテンツ */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {children}
          </main>

          {/* フッター */}
          <footer className="bg-white/50 backdrop-blur-lg border-t border-gray-200/50 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <p className="text-gray-600 font-medium mb-2">
                  © 2025 完全幹事AI
                </p>
                <p className="text-sm text-gray-500">
                  Powered by AI & Next.js 🚀
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}