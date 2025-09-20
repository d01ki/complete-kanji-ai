# 完全幹事AI 🤖

飲み会・イベントの幹事タスクを自動化するWebアプリケーション

## 🚀 技術スタック

- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Database**: SQLite + Prisma
- **AI**: OpenAI API (GPT-4)
- **UI**: Heroicons

## 🎯 主要機能

- ✅ イベント作成・管理
- ✅ 日程調整（投票システム）
- ✅ AI会場提案（OpenAI GPT-4）
- ✅ 進捗管理
- ✅ 参加者管理

## 🛠 セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/d01ki/complete-kanji-ai.git
cd complete-kanji-ai
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

```bash
cp .env.example .env
```

`.env`ファイルを編集して以下の設定を追加：

```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your_openai_api_key_here"
```

### 4. データベースの初期化

```bash
npm run db:push
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス

## 📋 使用方法

### 1. イベント作成
- トップページの「新規イベント作成」をクリック
- 基本情報（タイトル、説明、予算）を入力
- 日程候補を追加
- 参加者を追加
- 「イベントを作成」をクリック

### 2. 日程調整
- イベント詳細ページで参加者を選択
- 各日程候補に投票
- 最も票が多い日程を決定

### 3. AI会場提案
- 日程決定後、「AI会場提案を生成」ボタンをクリック
- OpenAI GPT-4が予算・人数・条件に基づいて会場を提案
- 気に入った会場を選択して決定

### 4. イベント確定
- 日程と会場が決定したらイベントが確定状態になります

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# リント
npm run lint

# Prisma Studio（DB GUI）
npm run db:studio

# データベーススキーマ更新
npm run db:push
```

## 📁 プロジェクト構造

```
complet-kanji-ai/
├── prisma/
│   └── schema.prisma      # データベーススキーマ
├── src/
│   ├── app/
│   │   ├── api/          # APIルート
│   │   │   └── events/   # イベント関連API
│   │   ├── events/       # イベントページ
│   │   ├── globals.css   # グローバルCSS
│   │   ├── layout.tsx    # レイアウト
│   │   └── page.tsx      # トップページ
│   ├── components/       # Reactコンポーネント
│   └── lib/             # ユーティリティ
│       ├── prisma.ts    # Prismaクライアント
│       └── openai.ts    # OpenAI統合
├── .env                  # 環境変数
├── package.json
└── tsconfig.json
```

## 🔑 主要なAPI

### イベント管理
- `GET /api/events` - イベント一覧取得
- `POST /api/events` - イベント作成
- `GET /api/events/[id]` - イベント詳細取得
- `PATCH /api/events/[id]` - イベント更新
- `DELETE /api/events/[id]` - イベント削除

### 投票システム
- `POST /api/events/[id]/vote` - 日程に投票
- `PUT /api/events/[id]/vote` - 日程を決定

### AI会場提案
- `POST /api/events/[id]/venues` - AI会場提案を生成
- `GET /api/events/[id]/venues` - 会場オプション一覧

## 🔒 セキュリティ

- 環境変数は `.env` ファイルで管理
- APIキーはリポジトリに含めない
- 本番環境では適切な認証を実装してください

## 📝 今後の実装予定

- [ ] Slack統合（通知機能）
- [ ] メール通知
- [ ] カレンダー連携
- [ ] 会場の詳細情報取得（食べログAPI等）
- [ ] ユーザー認証
- [ ] イベントの編集機能
- [ ] リマインダー機能

## 🤝 コントリビューション

プルリクエストは歓迎します！大きな変更の場合は、まずIssueを開いて変更内容を議論してください。

## 📄 ライセンス

MIT License

## 👨‍💻 開発者

Created by [d01ki](https://github.com/d01ki)