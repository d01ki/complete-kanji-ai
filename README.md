# 完全幹事AI 🤖

飲み会・イベントの幹事タスクを自動化するWebアプリケーション

## 🚀 技術スタック

- **フロントエンド & バックエンド**: Next.js 14 (TypeScript)
- **UI**: TailwindCSS + Heroicons
- **AI**: LangChain.js + OpenAI API (GPT-4)
- **データベース**: PostgreSQL + Prisma
- **通知**: Slack Webhook API
- **認証**: HTTP Basic Auth（開発段階）

## 🎯 主要機能

- ✅ **イベント作成**: タイトル・日程候補・参加者・予算設定
- ✅ **日程調整**: 参加者投票 & 自動決定
- ✅ **AI会場提案**: OpenAI APIによる条件に合った会場候補生成
- ✅ **Slack通知**: 各段階での自動通知
- ✅ **リアルタイム進捗管理**: ダッシュボードで全体管理

## 🛠 セットアップ

### 1. リポジトリクローン

```bash
git clone https://github.com/d01ki/complete-kanji-ai.git
cd complete-kanji-ai
```

### 2. 依存関係インストール

```bash
npm install
```

### 3. 環境変数設定

`.env.example`を`.env`にコピーして設定：

```bash
cp .env.example .env
```

### 4. データベースセットアップ

PostgreSQLが起動していることを確認してから：

```bash
# Prismaクライアント生成
npx prisma generate

# データベーススキーマ適用
npx prisma db push

# （任意）Prisma Studioでデータ確認
npx prisma studio
```

### 5. 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス
## 📋 使用手順

### 1. イベント作成
1. ダッシュボードの「新規イベント作成」ボタンをクリック
2. イベント名・説明・予算・場所条件を入力
3. 日程候補を追加（複数設定可能）
4. 参加者のSlack ID・名前を追加
5. 「イベント作成 & Slack通知」で作成 → Slack自動通知

### 2. 日程調整
1. イベント詳細ページで投票状況を確認
2. 「投票終了 & 日程決定」で最多票の日程を自動決定
3. ステータスが「会場選び中」に変更 → Slack通知

### 3. 会場選択
1. 「🤖 AI会場提案」ボタンでAI候補生成
2. 条件に合った会場が3件自動提案される
3. 「この会場に決定」で確定 → Slack通知
4. イベント確定完了

## 🔧 開発情報

### プロジェクト構成

```
src/
├── app/                    # Next.js App Router
│   ├── api/events/        # APIエンドポイント
│   ├── events/            # イベント関連ページ
│   ├── globals.css        # グローバルCSS
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ダッシュボード
├── components/            # Reactコンポーネント
│   ├── DateVotingSection.tsx
│   └── VenueSelectionSection.tsx
├── lib/                   # ユーティリティ
│   ├── prisma.ts          # Prismaクライアント
│   └── slack.ts           # Slack通知機能
└── middleware.ts          # Basic認証
```

### 主要API

- `POST /api/events` - イベント作成
- `POST /api/events/[id]/finalize-date` - 日程決定
- `POST /api/events/[id]/generate-venues` - AI会場提案
- `POST /api/events/[id]/select-venue` - 会場選択

### データベーススキーマ

Prismaスキーマ（`prisma/schema.prisma`）参照
- Events（イベント）
- EventDateOptions（日程候補）
- EventParticipants（参加者）
- EventVenueOptions（会場候補）
- SlackNotifications（通知履歴）

## 🚀 本番デプロイ

### Render.com へのデプロイ

1. [Render](https://render.com) でアカウント作成
2. GitHubリポジトリを接続
3. Web Service として作成
4. 環境変数を設定
5. PostgreSQL データベースを作成・接続
6. 自動デプロイ

### 環境変数（本番）

```env
DEV_USERNAME=your-username
DEV_PASSWORD=your-secure-password
OPENAI_API_KEY=sk-proj-your-real-openai-key
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook
DATABASE_URL=postgresql://render-postgres-url
NEXT_PUBLIC_APP_URL=https://your-app.onrender.com
```

## 🔄 今後の実装予定

- [ ] 日程投票機能（参加者がアプリ上で投票）
- [ ] 食べログAPI統合（実際の店舗情報取得）
- [ ] Redis + BullMQ（リマインダー・会計管理）
- [ ] 会計精算機能
- [ ] メール通知
- [ ] より詳細なAI提案

## 🎨 スクリーンショット

（実際の画面キャプチャを追加予定）

## 📄 ライセンス

MIT License

## 👨‍💻 開発者

Created by [d01ki](https://github.com/d01ki)

---

**開発状況**: MVP完成 ✅  
**動作確認**: ローカル開発環境での基本フロー動作確認済み
