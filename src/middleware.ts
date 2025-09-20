// Basic認証を削除 - 誰でもアクセス可能
// 必要に応じて後で認証機能を追加してください

export function middleware() {
  // 認証なし - すべてのリクエストを許可
  return null
}

export const config = {
  matcher: [],
}