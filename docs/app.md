# 月ウサギのそだてかた 攻略サイト

## 概要

「月ウサギのそだてかた」の武器合成の計画とガチャ分析ができるWebアプリケーションです。
目標の武器を作るのに何日かかるか、ガチャを何回引けばいいかを計算できます。
完全レスポンシブ対応で、スマートフォンからも快適に利用可能です。

## 技術スタック

- **Astro 5**: フレームワーク（built-in i18n routing）
- **React 19**: UIコンポーネント
- **Tailwind CSS 4**: スタイリング
- **TypeScript**: 型安全な開発

## 多言語対応（i18n）

日本語（デフォルト）と英語の2言語に対応しています。

### URL構造

- 日本語: `/`, `/weapons`, `/weapons/goal`, `/weapons/gacha`（プレフィックスなし）
- 英語: `/en/`, `/en/weapons`, `/en/weapons/goal`, `/en/weapons/gacha`

### ルーティング構造

- 日本語ページは `src/pages/` 直下（デフォルトロケール、プレフィックスなし）
- 英語ページは `src/pages/en/` に配置
- 言語追加時は `src/pages/{lang}/` ディレクトリを作成し、各ページを配置

### 翻訳の仕組み

- **翻訳ファイル**: `src/i18n/` に TypeScript で管理
  - `types.ts` - `Locale` 型と `Translations` インターフェース
  - `ja.ts` / `en.ts` - 各言語の翻訳テキスト
  - `index.ts` - `getTranslations()`, `getStaticLocalePaths()`, `getLocalePath()`, `getAlternatePath()` 等
- **定数**: `src/lib/weapons/constants.ts` の `levelNames`, `tierNames` は `Record<Locale, Record<...>>` 構造
- **武器名表示**: `getWeaponDisplayName(name, locale)` でロケール対応

### React コンポーネントでの使い方

各コンポーネントは `locale` prop（デフォルト `'ja'`）を受け取ります:

```tsx
// Astroページから渡す
<WeaponCatalog locale={locale} client:load />

// コンポーネント内で翻訳取得
const t = getTranslations(locale);
```

### SEO

- `<html lang="{locale}">` を動的に設定
- hreflang タグ（`ja`, `en`, `x-default`）を全ページに出力
- `og:locale` を動的に設定（`ja_JP` / `en_US`）

### 新しいテキストを追加する場合

1. `src/i18n/types.ts` の `Translations` に型を追加
2. `src/i18n/ja.ts` と各言語の翻訳ファイルに翻訳テキストを追加
3. コンポーネントで `t.xxx.yyy` として使用

### 新しい言語を追加する場合

1. `src/i18n/types.ts` の `Locale` 型にロケールコードを追加
2. `src/i18n/{lang}.ts` を作成（`en.ts` をベースに翻訳）
3. `src/i18n/index.ts` の `locales` 配列と `translations` に追加
4. `src/lib/weapons/constants.ts` の `levelNames`, `tierNames` に追加
5. `astro.config.mjs` の `i18n.locales` に追加
6. `src/pages/{lang}/` ディレクトリを作成し、`en/` のページをコピーして `locale` を変更

## 主要機能

### 1. 武器図鑑 (`/weapons`, `/en/weapons`)

全武器のレア度とドラバス（L1）換算の必要本数を一覧表示します。

**機能:**
- レア度別の武器一覧（Star, Galaxy, Universe）
- 基準武器（L1等）に対する必要本数の計算
- レスポンシブなグリッドレイアウト

**コンポーネント:** `components/weapons/WeaponCatalog.tsx`

### 2. 目標計算 (`/weapons/goal`, `/en/weapons/goal`)

作りたい武器と手持ち武器を入力して、目標達成までに必要な日数を計算します。

**機能:**
- **目標設定**: 目標武器の選択（レジェンド最上級 L1 以上のみ）、目標本数の設定
- **手持ち武器**: ティアごとのアコーディオン式入力、全レア度の所持数入力
- **達成予測設定**: 1日の獲得数（レジェンド最上級換算）の設定
- **結果表示**: 必要総数、所持数、不足数（全てL1換算）、達成予定日と進捗率の可視化

**コンポーネント:** `components/weapons/GoalCalculator.tsx`

### 3. ガチャ分析 (`/weapons/gacha`, `/en/weapons/gacha`)

ガチャN回で何の武器が作れるかを分析し、G1やU4までの道のりを可視化します。

**機能:**
- **シミュレーション設定**: ガチャレベル（Lv.8〜14）、ガチャ回数（プリセット選択または任意入力）
- **分析結果**: 消費ルビーの概算、獲得できる「レジェンド最上級」の総換算数、合成後に獲得できる最高レアリティ武器
- **詳細**: 最終的に合成して入手できる武器一覧、各レア度の排出確率テーブル

**コンポーネント:** `components/weapons/GachaAnalyzer.tsx`

### 4. ホーム (`/`, `/en/`)

各ツールへのナビゲーションを表示します。

**機能:**
- サイト説明
- ツールカード（各ページへのリンク）
- モバイル対応スライドメニュー（全ページ共通レイアウト）

**コンポーネント:** `components/home/HomePage.tsx`

## 用語集

### 基本用語

- **ドラバス**: L1（ドラゴンブレス バズーカ）の略称。合成の基準となる武器
- **レア度**: 武器の希少度。Legend → Star → Galaxy → Universe の順に高くなる
- **ティア**: レア度の大分類（Legend, Star, Galaxy, Universe）
- **レベル**: 各ティア内での段階（4, 3, 2, 1）

### レア度表記

- **L4〜L1**: Legend（レジェンド）
- **S4〜S1**: Star（スター）
- **G4〜G1**: Galaxy（ギャラクシー）
- **U4**: Universe（ユニバース）

### レア度の見方

- **X4**: 下級（最も低いランク）
- **X3**: 中級
- **X2**: 上級
- **X1**: 最上級（各ティアで最も高いランク）

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動（localhost:4321）
npm run dev

# 本番ビルド
npm run build

# ビルドのプレビュー
npm run preview
```

## プロジェクト構成

```
/
├── src/
│   ├── components/
│   │   ├── ui/                    # 共通UIコンポーネント
│   │   │   ├── SummaryCard.tsx    # 統計カード
│   │   │   ├── WeaponCard.tsx     # 武器表示カード（locale prop対応）
│   │   │   └── index.ts
│   │   ├── home/                   # ホームページ
│   │   │   ├── HomePage.tsx       # ホーム画面（locale prop対応）
│   │   │   └── index.ts
│   │   └── weapons/               # 武器関連コンポーネント（全てlocale prop対応）
│   │       ├── GachaAnalyzer.tsx  # ガチャ分析
│   │       ├── GoalCalculator.tsx # 目標計算
│   │       ├── WeaponCatalog.tsx  # 武器図鑑
│   │       └── index.ts
│   ├── i18n/                      # 多言語対応
│   │   ├── types.ts               # Locale型、Translationsインターフェース
│   │   ├── ja.ts                  # 日本語翻訳
│   │   ├── en.ts                  # 英語翻訳
│   │   └── index.ts               # getTranslations(), getLocalePath()等
│   ├── lib/
│   │   └── weapons/               # 武器データ（単一ソース）
│   │       ├── types.ts           # 武器定義、合成ルール、型
│   │       ├── gacha.ts           # ガチャ確率データ
│   │       ├── images.ts          # 武器画像インポート
│   │       ├── constants.ts       # 定数（色、ロケール別名前）
│   │       ├── data.ts            # 武器一覧生成
│   │       ├── synthesis.ts       # 合成ロジック
│   │       ├── utils.ts           # ユーティリティ関数（locale対応）
│   │       └── index.ts           # re-export
│   ├── utils/
│   │   └── expectationCalculator.ts  # ガチャ期待値計算
│   ├── layouts/
│   │   └── Layout.astro           # 共通レイアウト（i18n対応、言語切替付き）
│   ├── pages/
│   │   ├── index.astro            # ホーム（日本語）
│   │   ├── weapons/
│   │   │   ├── index.astro        # 武器図鑑（日本語）
│   │   │   ├── goal.astro         # 目標計算（日本語）
│   │   │   └── gacha.astro        # ガチャ分析（日本語）
│   │   └── en/                    # 英語ページ
│   │       ├── index.astro        # ホーム（英語）
│   │       └── weapons/
│   │           ├── index.astro    # 武器図鑑（英語）
│   │           ├── goal.astro     # 目標計算（英語）
│   │           └── gacha.astro    # ガチャ分析（英語）
│   ├── assets/                    # 武器画像
│   ├── styles/
│   │   └── global.css             # グローバルスタイル
│   └── types/
│       └── index.ts               # 型re-export
├── docs/                          # ドキュメント
│   ├── app.md                     # このファイル
│   ├── weapon.md                  # 武器一覧
│   ├── synthesis.md               # 合成システム
│   └── gacha.md                   # ガチャ確率
├── CLAUDE.md                      # Claude用プロジェクト説明
└── package.json
```

## 関連ドキュメント

- [武器一覧](./weapon.md) - 全武器のレア度とドラバス換算値
- [合成システム](./synthesis.md) - 武器合成のルールと必要素材数
- [ガチャ確率](./gacha.md) - レベル別のガチャ排出確率
