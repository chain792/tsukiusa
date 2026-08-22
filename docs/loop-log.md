# 改善ループ記録

`tsukiusa-loop` スキルで1周まわすごとに追記する。

---

## #1 — 2026-08-23

### リサーチ
- 公式Discord #パッチノート を 2026-06-25 / 07-14 / 07-30 / 08-13 の4件読み、`docs/patchnotes/` に要約を作成
  - パッチノートは縦長画像スライドのため、ページ内オーバーレイ＋スクリーンショットでOCRする手法を確立
- 公式@wiki（`w.atwiki.jp/tsukiusa`）を発見。**武器の確定数値は wiki が最速かつ正確**
  - `WebFetch` は 403。Chrome拡張タブからの `fetch` で取得

### 判明した差分
- **ユニバース中級（U3）= 銀色の銀河バズーカ** が追加されていた（2026-06-25）
- **武器ガチャ Lv.15** が追加（Legend 5% / Star 0.2%）

### 実装
- `U3` を武器データ・合成ルール（U4×2 → U3、L1換算 3,456本）・画像・図鑑に追加
- 武器アイコン `src/assets/U3.png` を @wiki から取得（400×400 に統一）
- ガチャ Lv.15 を追加（ノーマル率 0.9% は他等級からの逆算、累積ボーナス 700回）
- ガチャシミュレータのデフォルトを Lv.15 に変更
- `docs/weapon.md` に全等級の攻撃力データを追加
- `docs/synthesis.md` / `docs/gacha.md` を更新

### 作ったもの
- `.claude/skills/tsukiusa-research/SKILL.md` — 情報収集の手順
- `.claude/skills/tsukiusa-loop/SKILL.md` — このループ自体の手順
- `docs/ideas.md` — アイデアのバックログ

### 学び
- Discord の添付画像URLは署名付きクエリを含み、ツール出力ではマスクされる。**ページ内で完結する処理**に寄せるのが正解
- 全画像を offset 0 だけ先にスキャンして見出しを把握 → 必要な箇所だけ深掘り、が一番速い
- @wiki は 2022年で止まっているページと 2026年更新のページが混在。**最終更新日を必ず見る**
- ゲーム内数値（合成本数・ボーナス回数）は推測せずユーザーに確認するのが正解だった

### 追加対応（同日・フィードバック反映）
- **英語版のゲーム名が誤りだった**: `How to Raise a Moon Rabbit`（直訳）→ 公式英語名 **`Idle MoonRabbit: AFK RPG`** に修正
  - サイドバー見出しが `Tsukiusa` ベタ書きだったので `layout.gameTitle` を i18n に新設して置換
  - `siteName` を `Idle MoonRabbit Guide`、`mobileTitle` を `MoonRabbit Guide` に
  - `Layout.astro` の defaultDescription、`pages/en/index.astro` の alt テキストも修正
- 英語ページ全体を実機確認。本文の翻訳自体は問題なし（ゲーム名とブランディングのみが誤りだった）

### 残課題
- **#お知らせ チャンネル未読**（Discordのログインが切れたため）
- 武器等級の英語表記 `Universe Low / Star Supreme` 等がゲーム内公式表記と一致するか未確認

### 次にやること
- `docs/ideas.md` の優先度「高」から1〜2個
