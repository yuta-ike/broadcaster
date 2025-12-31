# Broadcaster Slack Integration

## Functions

- generate-broadcaster-web: 指定された Slack メッセージをテンプレートに設定して、Web エディタを開くリンクを提供する Function
- register-sponsor: スポンサーを登録するための Slack ワークフロー

## ローカル開発

- `manifest.ts` の outgoingDomains に localhost を追加
- `api-client.ts` の Base URL を localhost:3000 に変更

## デプロイ

```sh
slack deploy
```
