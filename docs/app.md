# 月ウサギのそだてかた 攻略ツール

## 概要
「月ウサギのそだてかた」の武器合成の計画とガチャ分析ができるWebアプリケーションです。
目標の武器を作るのに何日かかるか、ガチャを何回引けばいいかを計算できます。

## 技術スタック
- **Astro 5.17**: フレームワーク
- **React 19**: UIコンポーネント
- **Tailwind CSS 4**: スタイリング
- **TypeScript**: 型安全な開発

## 主要機能

### 1. 目標計算 (`/goal`)
作りたい武器と手持ち武器を入力して、目標達成までに必要な日数を計算します。

**機能:**
- 目標武器の選択（レア度別）
- 手持ち武器の数量入力
- 1日あたりのガチャ回数設定
- 現在のガチャレベル設定
- 必要日数の自動計算

**コンポーネント:** `GoalCalculator.tsx`

### 2. ガチャ分析 (`/gacha`)
ガチャN回で何の武器が作れるかを分析し、G1やU4までの道のりを可視化します。

**機能:**
- ガチャ回数の入力
- ガチャレベルの選択（レベル8〜14）
- 各レア度の期待獲得数計算
- 合成後の武器数シミュレーション
- 到達可能な最高レア度の表示

**コンポーネント:**
- `GachaSimulator.tsx`: ガチャシミュレーション
- `GachaAnalyzer.tsx`: ガチャ分析
- `ExpectationAnalyzer.tsx`: 期待値分析

### 3. 武器図鑑 (`/weapons`)
全武器のレア度とドラバス（L1）換算の必要本数を一覧表示します。

**機能:**
- レア度別の武器一覧
- ドラバス換算値の表示
- 武器の日本語名表示
- 合成ルールの早見表

**コンポーネント:** `SynthesisCalculator.tsx`

### 4. ホーム (`/`)
各ツールへのナビゲーションと合成ルールの早見表を表示します。

**機能:**
- サイト説明
- ツールカード（各ページへのリンク）
- 合成ルール早見表
- ドラバス換算早見表

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

## データファイル

### `src/data/synthesis.ts`
武器の合成ルールと必要素材数の定義。

**主要データ:**
- `synthesisRules`: 合成ルール配列
- `requiredL1Map`: ドラバス換算表
- `findSynthesisRule()`: 合成ルール検索関数
- `getRequiredL1()`: 必要ドラバス数取得関数

### `src/data/gacha.ts`
ガチャの確率テーブルとレベル別設定。

**主要データ:**
- `gachaRates`: レベル8〜14の確率テーブル
- `getGachaRate()`: ガチャレート取得関数
- `calculateActualProbabilities()`: 実際の排出確率計算関数

### `src/types.ts`
型定義ファイル。

**主要型:**
- `WeaponRarity`: 武器のレア度型
- `SynthesisRule`: 合成ルール型
- `GachaRate`: ガチャ確率型

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
│   ├── components/       # Reactコンポーネント
│   │   ├── GachaSimulator.tsx
│   │   ├── GachaAnalyzer.tsx
│   │   ├── ExpectationAnalyzer.tsx
│   │   ├── GoalCalculator.tsx
│   │   └── SynthesisCalculator.tsx
│   ├── data/             # ゲームデータ
│   │   ├── synthesis.ts
│   │   └── gacha.ts
│   ├── layouts/          # レイアウトコンポーネント
│   ├── pages/            # ページファイル
│   │   ├── index.astro
│   │   ├── goal.astro
│   │   ├── gacha.astro
│   │   └── weapons.astro
│   └── types.ts          # TypeScript型定義
├── docs/                 # ドキュメント
│   ├── app.md           # このファイル
│   ├── weapon.md        # 武器一覧
│   ├── synthesis.md     # 合成システム
│   └── gacha.md         # ガチャ確率
└── package.json
```

## 関連ドキュメント

- [武器一覧](./weapon.md) - 全武器のレア度とドラバス換算値
- [合成システム](./synthesis.md) - 武器合成のルールと必要素材数
- [ガチャ確率](./gacha.md) - レベル別のガチャ排出確率
