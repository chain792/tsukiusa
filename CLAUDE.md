# 月ウサギのそだてかた 攻略サイト

「月ウサギのそだてかた」の武器合成・ガチャ分析ツール。

## 技術スタック

Astro 5 + React 19 + TypeScript + Tailwind CSS 4

## 多言語対応（i18n）

- 日本語（デフォルト、プレフィックスなし）と英語（`/en/` プレフィックス）の2言語対応
- Astro 5 built-in i18n routing を使用（`astro.config.mjs` の `i18n` 設定）
- 翻訳ファイルは `src/i18n/` に TypeScript で管理（型安全）
- React コンポーネントは `locale` prop を受け取り、`getTranslations(locale)` で翻訳を取得
- 武器名の表示は `getWeaponDisplayName(name, locale)` でロケール対応
- 英語ページは `src/pages/en/` に配置
- 言語追加時: `i18n/types.ts` の `Locale` 型、`i18n/index.ts` の `locales` 配列、翻訳ファイル、`astro.config.mjs` の `locales`、`src/pages/{lang}/` ディレクトリを追加

## コーディング規約

- UIコンポーネントは `components/ui/` に配置
- 機能別コンポーネントは `components/{機能名}/` に配置
- 新しいテキストは翻訳ファイル（`src/i18n/ja.ts`, `src/i18n/en.ts`）に追加し、ハードコードしない

## ドキュメント

詳細は `docs/` 参照：
- `docs/app.md` - アプリケーション仕様、プロジェクト構成
- `docs/weapon.md` - 武器一覧、L1換算値、攻撃力データ
- `docs/skill.md` - スキルのデータスキーマ、出典、スキルルーン確率
- `docs/synthesis.md` - 合成ルール
- `docs/gacha.md` - ガチャ確率、累積ボーナス
- `docs/patchnotes/` - 公式パッチノートの要約（1アップデート1ファイル）
- `docs/ideas.md` - 新機能・新ページのバックログ
- `docs/loop-log.md` - 改善ループの記録

## スキル

- `tsukiusa-research` - 公式Discord・公式@wikiから最新情報を収集して docs に反映する
- `tsukiusa-loop` - リサーチ→企画→実装→フィードバックのループを1周まわす

ゲーム情報の調査やサイト改善を進めるときは、まずこれらのスキルを呼ぶこと。
