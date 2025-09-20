# 完全幹事AI 🤖

飲み会・イベントの幹事タスクを自動化するWebアプリケーション

## 🚀 技術スタック

- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Database**: JSONファイルベース（シンプル実装）
- **AI**: OpenAI API（オプション）
- **UI**: Heroicons

## 🎯 主要機能

- ✅ イベント作成・管理
- ✅ 日程調整
- ✅ AI会場提案（OpenAI APIキーなしでもダミーデータで動作）
- ✅ 進捗管理
- ✅ 通知履歴

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
```

`.env`ファイルを編集：

```env
# Database（自動作成されるので変更不要）
DATABASE_URL="file:./dev.db"

# OpenAI API（オプション - なくても動作します）
OPENAI_API_KEY="your-openai-api-key-here"

# App Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス

## 📋 使用方法

### 1. イベント作成

1. ダッシュボードの「新規イベント作成」ボタンをクリック
2. 以下の情報を入力：
   - **イベント名**（必須）
   - **説明**（任意）
   - **予算**（任意）
   - **場所の条件**（任意）
   - **日程候補**（必須・複数可）
   - **参加者**（必須・複数可）
3. 「イベント作成」ボタンをクリック

### 2. 日程調整

1. イベント詳細ページで日程候補から選択
2. 「この日程で決定して次へ」をクリック
3. 自動的に会場選択フェーズに移行

### 3. 会場選択

1. 「AI会場提案」ボタンをクリック
   - OpenAI APIキーがあれば実際のAI提案
   - なければダミーデータで提案
2. 提案された会場から選択
3. 「この会場で確定」をクリック

### 4. イベント確定

- 日程と会場が決定すると自動的に確定状態に
- 確定情報が表示されます

## 🗂 データ保存

- データは `data/events.json` ファイルに保存されます
- このファイルは初回起動時に自動作成されます
- バックアップが必要な場合はこのファイルをコピーしてください

## 🔧 トラブルシューティング

### ポート3000が使用中の場合

```bash
npm run dev -- -p 3001
```

### データをリセットしたい場合

```bash
rm -rf data/events.json
```

### ビルドエラーが出る場合

```bash
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

## 📦 本番ビルド

```bash
npm run build
npm start
```

## 🌟 特徴

1. **シンプルなデータ管理**
   - データベース不要
   - JSONファイルベースで管理が簡単

2. **OpenAI API不要でも動作**
   - APIキーがなくてもダミーデータで完全動作
   - 開発・テストが容易

3. **モダンなUI/UX**
   - TailwindCSSによる美しいデザイン
   - レスポンシブ対応
   - 直感的な操作性

4. **拡張性**
   - 必要に応じてデータベースに移行可能
   - AI機能の強化が容易

## 🔒 セキュリティ

- 環境変数は `.env` ファイルで管理
- `.env` ファイルはGitにコミットされません
- 本番環境では適切な認証を実装してください

## 📄 ライセンス

MIT License

## 👨‍💻 開発者

Created by [d01ki](https://github.com/d01ki)

## 🤝 コントリビューション

プルリクエストを歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📞 サポート

問題が発生した場合は、GitHubのIssueで報告してください。