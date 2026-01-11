# Broadcaster

Slack 一斉送信などを行うための管理ツール

## Admin Web

- packages/admin: 管理ツール本体
- packages/components: UI コンポーネント群
- packages/db: DB スキーマ・マイグレーション

## Slack Workflow

- slack: Slack Workflow 定義

## GAS

- gas: Google Apps Script (GAS) で動作する cron 用のスクリプト

## デプロイ

```sh
pnpm exec vercel deploy
```

## マイグレーション

### ローカル

```sh
cd packages/db
pnpm db:gen
pnpm db:migrate
```

### 本番

```sh
cd packages/db
POSTGRES_URL="postgres://user:password@host:port/dbname" pnpm exec drizzle-kit migrate
```
