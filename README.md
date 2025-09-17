# 完全幹事AI 🤖

飲み会・イベントの幹事タスクを自動化するWebアプリケーション

## 🚀 技術スタック

- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Database**: SQLite + Prisma
- **AI**: OpenAI API
- **UI**: Heroicons

## 🎯 主要機能

- ✅ イベント作成・管理
- ✅ 日程調整
- ✅ AI会場提案
- ✅ 進捗管理

## 🛠 セットアップ

### 1. インストール

```bash
git clone https://github.com/d01ki/complete-kanji-ai.git
cd complete-kanji-ai
npm install
```

### 2. 環境設定

```bash
cp .env.example .env
# .envファイルを編集して必要な設定を追加
```

### 3. データベース初期化

```bash
npx prisma generate
npx prisma db push
```

### 4. 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス

## 📋 使用方法

1. **イベント作成**: 基本情報・日程候補・参加者を入力
2. **日程調整**: 投票結果を確認して日程決定
3. **会場選択**: AI提案から会場を選択
4. **完了**: 全て決定してイベント確定

## 🔒 セキュリティ

- 環境変数は `.env` ファイルで管理
- 機密情報はリポジトリに含めない
- 本番環境では適切な認証を実装してください

## 📄 ライセンス

MIT License

## 👨‍💻 開発者

Created by [d01ki](https://github.com/d01ki)