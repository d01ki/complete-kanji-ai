# 完全幹事AI 🤖

飲み会・イベントの幹事タスクを完全自動化するWebアプリケーション

## 🚀 技術スタック

- **Frontend**: Next.js 14 (App Router) + TypeScript + TailwindCSS
- **Database**: SQLite + Prisma ORM
- **AI**: OpenAI GPT-4 + Vercel AI SDK
- **API**: Hotpepper Gourmet API / Google Places API
- **UI**: Heroicons
- **Calendar**: Google Calendar API / iCal

## 🎯 主要機能

### ✅ 実装済み機能

1. **イベント作成・管理**
   - 基本情報入力（タイトル、説明、予算、場所条件）
   - 日程候補の登録
   - 参加者管理

2. **日程調整システム**
   - 参加者による投票機能
   - リアルタイム票数表示
   - 投票のトグル（取り消し）機能
   - 最多得票の日程を決定

3. **AIエージェント会場提案**
   - GPT-4による実在する会場の提案
   - Hotpepper API / Google Places APIとの連携
   - 予算・人数・条件に基づく最適化
   - 会場詳細情報の表示（画像、評価、電話番号等）

4. **予約システム**
   - ワンクリック予約承認
   - Googleカレンダー自動追加
   - iCalファイルダウンロード
   - 参加者への通知

5. **会計計算機能**
   - AIエージェントによる自動計算
   - 参加人数のカスタマイズ対応
   - 支払い状況の管理
   - 一人あたりの金額を自動算出

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

`.env`ファイルを編集：

```env
# 必須
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="sk-..."  # OpenAI APIキー

# オプション（会場検索機能向上）
HOTPEPPER_API_KEY="..."  # Hotpepper API（無料）
GOOGLE_PLACES_API_KEY="..."  # Google Places API
GOOGLE_SERVICE_ACCOUNT_KEY='{...}'  # Googleカレンダー連携
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

1. トップページの「新規イベント作成」をクリック
2. 基本情報を入力
   - イベント名
   - 説明（オプション）
   - 一人あたりの予算
   - 場所の条件（例：渋谷、駅近、個室あり）
3. 日程候補を追加（複数可）
4. 参加者を追加
5. 「イベントを作成」をクリック

### 2. 日程調整

1. イベント詳細ページで参加者を選択
2. 各日程候補に投票
3. 最も票が多い日程を「この日程に決定」

### 3. AI会場提案

1. 日程決定後、「AI会場提案を生成」をクリック
2. AIが実在する会場を5つ提案
3. 各会場の詳細（場所、予算、評価、電話番号）を確認
4. 気に入った会場の「予約する」をクリック

### 4. 予約確定

1. 予約確認ダイアログで「OK」
2. 自動的に：
   - 会場が決定
   - Googleカレンダーに追加
   - iCalファイルがダウンロード
   - 参加者にメール通知（設定済みの場合）

### 5. 会計計算

1. イベント確定後、会計計算セクションが表示
2. 合計金額を入力
3. 人数を確認（欠席者がいれば調整）
4. 「会計を計算」をクリック
5. 一人あたりの金額が表示
6. 支払い状況をチェックマークで管理

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
complete-kanji-ai/
├── prisma/
│   └── schema.prisma          # データベーススキーマ
├── src/
│   ├── app/
│   │   ├── api/               # API Routes
│   │   │   └── events/
│   │   │       ├── route.ts   # イベントCRUD
│   │   │       └── [id]/
│   │   │           ├── route.ts      # 詳細・更新
│   │   │           ├── vote/         # 投票API
│   │   │           ├── venues/       # 会場提案API
│   │   │           ├── reserve/      # 予約API
│   │   │           └── bill/         # 会計API
│   │   ├── events/            # イベントページ
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx           # トップページ
│   ├── components/
│   │   └── BillCalculator.tsx # 会計計算コンポーネント
│   └── lib/
│       ├── prisma.ts          # Prismaクライアント
│       ├── ai-agent.ts        # AIエージェント
│       ├── tabelog-api.ts     # 会場検索API
│       └── google-calendar.ts # カレンダー連携
├── .env                       # 環境変数
├── package.json
└── tsconfig.json
```

## 🔑 主要なAPI

### イベント管理
- `GET /api/events` - イベント一覧
- `POST /api/events` - イベント作成
- `GET /api/events/[id]` - イベント詳細
- `PATCH /api/events/[id]` - イベント更新

### 日程調整
- `POST /api/events/[id]/vote` - 投票
- `PUT /api/events/[id]/vote` - 日程決定

### AI会場提案
- `POST /api/events/[id]/venues` - AI会場提案生成
- `GET /api/events/[id]/venues` - 会場一覧

### 予約
- `POST /api/events/[id]/reserve` - 予約確定

### 会計
- `POST /api/events/[id]/bill` - 会計計算
- `GET /api/events/[id]/bill` - 会計情報取得
- `PATCH /api/events/[id]/bill` - 支払い状況更新

## 🔌 外部API

### Hotpepper Gourmet API（無料）

1. [リクルートWebサービス](https://webservice.recruit.co.jp/)でアカウント作成
2. APIキーを取得
3. `.env`に`HOTPEPPER_API_KEY`を設定

### Google Places API

1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクト作成
2. Places API を有効化
3. APIキーを作成
4. `.env`に`GOOGLE_PLACES_API_KEY`を設定

### Google Calendar API

1. Google Cloud Consoleでサービスアカウント作成
2. JSONキーをダウンロード
3. `.env`に`GOOGLE_SERVICE_ACCOUNT_KEY`を設定（JSON文字列）

## 🤖 AIエージェント機能

### Vercel AI SDK統合

このプロジェクトでは、Vercel AI SDKを使用してOpenAI GPT-4をエージェントとして活用しています：

**実装されているツール：**

1. **venueSearchTool** - 条件に基づく飲食店検索
2. **calculateBudgetTool** - 会計金額の自動計算

**エージェントの動作：**

1. ユーザーのリクエストを解析
2. 適切なツールを自動選択・実行
3. 結果を自然言語で説明
4. 複数ステップの推論が可能（maxSteps: 5）

### 会場提案の流れ

```typescript
// AIエージェントが自動的に：
1. イベント情報を分析
2. 適切な検索キーワードを生成
3. venueSearchToolを実行
4. 結果から最適な会場を選定
5. 推薦理由を説明
```

## 🔒 セキュリティ

- 環境変数は `.env` ファイルで管理
- APIキーはリポジトリに含めない
- 本番環境では適切な認証を実装してください
- SQLインジェクション対策（Prisma使用）
- XSS対策（Reactの自動エスケープ）

## 📝 今後の実装予定

- [ ] Slack統合（通知機能）
- [ ] LINE通知
- [ ] メール自動送信
- [ ] ユーザー認証
- [ ] イベントの編集機能
- [ ] リマインダー機能
- [ ] 領収書管理
- [ ] 多言語対応

## 🤝 コントリビューション

プルリクエストは歓迎します！大きな変更の場合は、まずIssueを開いて変更内容を議論してください。

## 📄 ライセンス

MIT License

## 👨‍💻 開発者

Created by [d01ki](https://github.com/d01ki)

## 🙏 謝辞

- OpenAI GPT-4
- Vercel AI SDK
- Next.js Team
- Prisma Team
- リクルート Hotpepper API

---

**完全幹事AI** - 幹事の負担をゼロに 🎉