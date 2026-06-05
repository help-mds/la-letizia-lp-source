# LP Factory テンプレート仕様書

## 概要

このリポジトリは、セールスKPIシステムの **LP Factory** から自動生成されるインタラクティブLPの**確定テンプレート**です。

**ライブデモ:**
- レストラン: https://laletizia-mvwtxft9.manus.space/lp/la-letizia-dubai-marina
- サロン: https://laletizia-mvwtxft9.manus.space/lp/noa-hair-tokyo-nakameguro?locale=en

---

## LP Factory フォーム仕様（新・3項目のみ）

### 入力項目

| # | フィールド | 型 | 必須 | 説明 |
|---|---|---|---|---|
| 1 | **店名** | `string` | ✅ | ローディング画面・ヘッダー・Accessセクションに表示 |
| 2 | **業種** | `enum: "restaurant" \| "salon"` | ✅ | テンプレート素材セットの切り替えに使用 |
| 3 | **GoogleマップURL** | `string (URL)` | ✅ | Accessセクションの地図埋め込み + 住所自動取得 |

### 廃止する項目（旧 /lp-input の全フィールド）

以下は全て不要。入力させない：
- エリア、サブタイプ、連絡先（電話・メール・WhatsApp・LINE・Instagram）
- テンプレート選択、アンビアンス設定（照明・素材・カラー・ムード・時間帯）
- コピー（ヒーロータグライン・サブタイトル・ストーリー・雰囲気キャプション・CTA）
- メニュー項目、ギャラリー画像
- ロゴ、写真URL

---

## テキスト固定ルール

**全てのテキストは `"xxxxxx"` 固定。** 店名と地図情報だけが実値。

| 箇所 | 表示テキスト | 備考 |
|---|---|---|
| ヒーロー eyebrow | `店名（実値）` | 唯一の実テキスト |
| ヒーロー title | `"xxxxxx xxxxxx"` | 固定 |
| ヒーロー subtitle | `"xxxxxx xxxxxx xxxxxx xxxxxx"` | 固定 |
| シーン遷移 eyebrow | `"xxxxxx"` | 固定 |
| シーン遷移 title | `"xxxxxx"` | 固定 |
| ホットスポット title | `"xxxxxx"` | 固定 |
| ホットスポット body | `"xxxxxx xxxxxx xxxxxx xxxxxx"` | 固定 |
| ホットスポット price | `"¥X,XXX"` | 固定 |
| 予約セクション title | `"xxxxxx xxxxxx"` | 固定 |
| 予約セクション subtitle | `"xxxxxx xxxxxx xxxxxx"` | 固定 |
| Access 住所 | `GoogleマップURLから自動取得` or `"xxxxxx"` | 地図URLから解析 |
| Access 営業時間 | `"XX:XX — XX:XX"` | 固定 |
| Access 備考 | `"xxxxxx xxxxxx xxxxxx"` | 固定 |

**営業フック:** テキストが全て `xxxxxx` なのは意図的。店主に「ここを埋めましょう」と打ち合わせを誘導するためのセールスツール。

---

## 業種別素材セット

業種を選ぶと、**コンテンツタブの該当業種の素材**を自動で当てこむ。

### 必要素材（業種ごとに1セット）

| 素材 | 用途 | フォーマット | サイズ目安 |
|---|---|---|---|
| **ヒーロー動画** (1本) | スクロールスクラブ用フレーム抽出 | MP4 → WebPフレーム | 8秒, 720p, 30fps = 240フレーム |
| **Space画像** (1枚) | シーン1 背景 | WebP | 1920x1080 |
| **Selection画像** (1枚) | シーン2 背景 | WebP | 1920x1080 |
| **Craft画像** (1枚) | シーン3 背景 | WebP | 1920x1080 |

### 素材マッピング（コード上の変数）

```typescript
// client/src/pages/InteractiveLpPage.tsx

// シーン背景画像
const SCENE_IMAGES_BY_SLUG: Record<string, Record<string, string>> = {
  '{slug}': {
    s1: '{Space画像URL}',    // コンテンツタブから取得
    s2: '{Selection画像URL}', // コンテンツタブから取得
    s3: '{Craft画像URL}',    // コンテンツタブから取得
  },
};

// ヒーロー動画フレーム
const FRAME_DATA_BY_SLUG: Record<string, { hero: { count: number; frames: string[] } }> = {
  '{slug}': {
    hero: {
      count: 240,  // 動画から抽出したフレーム数
      frames: ['{frame_001_URL}', '{frame_002_URL}', ...],  // 各フレームのURL
    }
  },
};
```

### 現在の素材セット

**restaurant:**
- ヒーロー動画: 240フレーム（`client/src/data/37west-frames.json`）
- Space: `/manus-storage/37west-space-interior_400cd9de.webp`
- Selection: `lp-selection-overhead-eHmSyrXD96nxSAFVzzMQiM.webp`
- Craft: `/manus-storage/lp-craft-scene_16c7baf2.png`

**salon:**
- ヒーロー動画: 32フレーム（`client/src/data/noa-hair-frames.json`）
- Space: `noa-space-interior-YFnW9GusRqg2qpSZU7PJ3s.webp`
- Selection: `noa-selection-overhead-L2j7VcBVnRf94ZeizB539m.webp`
- Craft: `noa-craft-hands-9vWzVS5P8zw2W8uBkwdSWm.webp`

---

## URL 構造

### 発行URL（店主向け）

```
https://saleskpi.xyz/sites/{連番ID}
```

**重要:** `*.manus.space` ドメインは絶対に店主向けに露出しない。

### 内部URL（開発/管理用）

```
/lp/{slug}
```

slug は `{店名}-{エリア}` のケバブケース（例: `la-letizia-dubai-marina`）

---

## LP 構造（6シーン）

```
┌─────────────────────────────────────────┐
│ 1. Hero (スクロールスクラブ動画)          │  ← ヒーロー動画フレーム
│    - ローディング画面 → フレーム再生      │
│    - スクロール完了 → シーンモードへ      │
├─────────────────────────────────────────┤
│ 2. Space (シーン1)                       │  ← Space画像 + ホットスポット3個
│    - インテリア/空間の紹介               │
├─────────────────────────────────────────┤
│ 3. Selection (シーン2)                   │  ← Selection画像 + ホットスポット3個
│    - メニュー/サービスの紹介             │
├─────────────────────────────────────────┤
│ 4. Craft (シーン3)                       │  ← Craft画像 + ホットスポット2個
│    - 技術/こだわりの紹介                 │
├─────────────────────────────────────────┤
│ 5. Access                                │  ← GoogleマップURL → 地図埋め込み
│    - 住所・営業時間・アクセス情報         │
├─────────────────────────────────────────┤
│ 6. Reserve (CTA)                         │  ← 予約チャネル一覧
│    - 電話/LINE/Instagram/WhatsApp/地図   │
└─────────────────────────────────────────┘
```

---

## LP Factory 実装手順

### 1. フォーム送信時の処理フロー

```
[フォーム入力: 店名 + 業種 + GoogleマップURL]
        ↓
[slug生成: kebab-case(店名)]
        ↓
[業種に応じた素材セットを自動割り当て]
  - restaurant → restaurant素材セット
  - salon → salon素材セット
        ↓
[DB にレコード作成]
  - storeName: 入力値
  - businessType: 入力値
  - googleMapsUrl: 入力値
  - slug: 自動生成
  - status: 'READY' (動画生成パイプラインは不要)
  - その他: 全てnull/デフォルト
        ↓
[LP発行: https://saleskpi.xyz/sites/{id}]
```

### 2. 素材差し替えのみで新LP生成

動画生成パイプライン（`server/pipeline/`）は**使わない**。素材は事前にコンテンツタブに業種別で用意しておき、業種選択で自動マッピングする。

### 3. GoogleマップURL → 地図埋め込み変換

```typescript
// GoogleマップURLからembedURLを生成する例
function googleMapsUrlToEmbed(url: string): string {
  // https://maps.google.com/maps?q=... → embed URL
  const match = url.match(/place\/([^/]+)/);
  if (match) {
    return `https://www.google.com/maps/embed/v1/place?key=API_KEY&q=${encodeURIComponent(match[1])}`;
  }
  // fallback: URLのq=パラメータを使う
  const qMatch = url.match(/[?&]q=([^&]+)/);
  if (qMatch) {
    return `https://www.google.com/maps/embed/v1/place?key=API_KEY&q=${qMatch[1]}`;
  }
  return url;
}
```

---

## コード上の差し替えポイント一覧

### 新しいLPを追加する際に変更が必要な箇所

| ファイル | 変数/箇所 | 差し替え内容 |
|---|---|---|
| `InteractiveLpPage.tsx` L117 | `SCENE_IMAGES_BY_SLUG[slug]` | 業種別の画像3枚URL |
| `InteractiveLpPage.tsx` L133 | `FRAME_DATA_BY_SLUG[slug]` | ヒーロー動画フレームJSON |
| `InteractiveLpPage.tsx` L147 | `HERO_OVERLAY_BY_SLUG[slug]` | eyebrow=店名, title/subtitle=xxxxxx |
| `client/src/data/` | `{slug}-frames.json` | 動画フレームURLリスト |
| DB `leads` テーブル | レコード | storeName, businessType, googleMapsUrl, slug |

### 変更不要（固定）

- ホットスポットデータ（業種別で固定、テキストは全て xxxxxx）
- シーン定義（Space/Selection/Craft/Access/Reserve の構成）
- UI コンポーネント全体（メタリックボタン、ドットナビ等）
- CSS スタイル全体
- 予約チャネル構成（電話/LINE/Instagram/WhatsApp/地図）

---

## セールスKPIシステムへの伝達事項

以下をセールスKPIシステムの LP Factory 実装担当に伝えてください：

> **「LP Factory テンプレート v1 確定。GitHub リポジトリ参照。」**
>
> - リポジトリ: https://github.com/help-mds/la-letizia-lp-source
> - 仕様書: `LP_FACTORY_TEMPLATE_SPEC.md`（このファイル）
>
> **要点:**
> 1. 入力フォームは **3項目のみ**（店名・業種・GoogleマップURL）に簡素化
> 2. テキストは全て `xxxxxx` 固定（店名と地図だけ実値）
> 3. 業種選択で素材セット（動画1 + 画像3）を自動割り当て
> 4. 発行URLは `https://saleskpi.xyz/sites/{連番}` — manus.space は露出しない
> 5. 動画生成パイプラインは不使用（事前用意の素材を当てこむだけ）
>
> **テンプレートの核心ファイル:**
> - `client/src/pages/InteractiveLpPage.tsx` — メインLP（全ロジック）
> - `client/src/components/interactive-lp/` — UIコンポーネント群
> - `client/src/components/interactive-lp/interactive-lp.css` — 全スタイル
> - `client/src/data/` — フレームデータJSON

---

## 素材準備チェックリスト（新業種追加時）

- [ ] ヒーロー動画（8秒, 720p, 店内ウォークスルー風）を撮影/生成
- [ ] 動画を30fpsでWebPフレーム抽出 → JSONファイル作成
- [ ] Space画像（店内全景）を用意
- [ ] Selection画像（メニュー/サービス俯瞰）を用意
- [ ] Craft画像（技術/こだわりのクローズアップ）を用意
- [ ] 全画像をストレージにアップロード
- [ ] `SCENE_IMAGES_BY_SLUG` にエントリ追加
- [ ] `FRAME_DATA_BY_SLUG` にエントリ追加
- [ ] `HERO_OVERLAY_BY_SLUG` にエントリ追加（eyebrow=店名）
