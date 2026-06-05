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
| **ヒーロー動画** (1本) | スクロールスクラブ用フレーム抽出 | MP4 → WebPフレーム | **全業種共通: 8秒, 720p, 30fps = 240フレーム必須** |
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
- ヒーロー動画: **240フレーム必須**（現在の `noa-hair-frames.json` は32フレームの暫定版。本番では240フレームに差し替え）
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

- [ ] ヒーロー動画（**8秒, 720p, 30fps = 240フレーム必須**。店内ウォークスルー風）を撮影/生成
- [ ] 動画を30fpsでWebPフレーム抽出（240枚）→ JSONファイル作成
- [ ] Space画像（店内全景）を用意
- [ ] Selection画像（メニュー/サービス俯瞰）を用意
- [ ] Craft画像（技術/こだわりのクローズアップ）を用意
- [ ] 全画像をストレージにアップロード
- [ ] `SCENE_IMAGES_BY_SLUG` にエントリ追加
- [ ] `FRAME_DATA_BY_SLUG` にエントリ追加
- [ ] `HERO_OVERLAY_BY_SLUG` にエントリ追加（eyebrow=店名）


---

## セールスKPI再現時の技術要件

### ヒーロー実装: `<canvas>` + WebPフレーム方式（必須）

セールスKPIシステムでLPを再現する際、ヒーローセクションは **`<video>` 要素ではなく `<canvas>` + WebPフレーム方式** を使用すること。

**理由:**

1. **iOS Safari 互換性**: `<video>` 要素のスクロールスクラブ（`currentTime` 操作）はiOS Safariで不安定。`<canvas>` + 画像フレームなら全ブラウザで確実に動作する。
2. **object-fit の信頼性**: `<video>` の `object-fit:cover` はブラウザ/OSバージョンで挙動が異なる。canvas描画ならJS側でcover-fit計算を完全制御できる。
3. **モバイル黒幕問題の防止**: `<video>` 要素はモバイルで黒幕（letterbox）が出る場合がある。canvas方式なら発生しない。

**実装仕様:**

```
┌─ 外側コンテナ (height: 400svh, position: relative) ─┐
│                                                       │
│  ┌─ sticky viewport (top:0, w:100%, h:100svh) ─┐    │
│  │                                               │    │
│  │  ┌─ <canvas> (absolute inset-0, w/h:100%) ─┐ │    │
│  │  │  JS cover-fit描画                        │ │    │
│  │  └─────────────────────────────────────────┘ │    │
│  │                                               │    │
│  │  [オーバーレイ: テキスト/UI]                   │    │
│  │                                               │    │
│  └───────────────────────────────────────────────┘    │
│                                                       │
└───────────────────────────────────────────────────────┘
```

**cover-fit描画ロジック:**

```typescript
// canvas描画時のcover-fit計算
const imgRatio = img.naturalWidth / img.naturalHeight;
const canvasRatio = canvasWidth / canvasHeight;

let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

if (imgRatio > canvasRatio) {
  // 画像が横長 → 左右クロップ
  sw = img.naturalHeight * canvasRatio;
  sx = (img.naturalWidth - sw) / 2;
} else {
  // 画像が縦長 → 上下クロップ
  sh = img.naturalWidth / canvasRatio;
  sy = (img.naturalHeight - sh) / 2;
}

ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
```

---

### スクロールリスナーの注意事項

本テンプレートのスクロールスクラブは **`window.addEventListener('scroll')` を使用** し、`getBoundingClientRect()` でスクロール進行度を計算している。

**セールスKPIホスティング環境の問題:**

セールスKPIシステム（`saleskpi.xyz/sites/{id}`）は、LPを `<iframe>` 的に埋め込む際に以下のCSSを `#root` に適用する:

```css
#root {
  overflow: hidden auto;
  height: 100vh; /* viewport高さに固定 */
}
```

この結果:
- `window` レベルのスクロールが発生しない（`window.scrollY` は常に0）
- スクロールは `#root` 要素内部で起きる
- `window` の `scroll` イベントが発火しない
- `getBoundingClientRect().top` が変化しない

**対策（セールスKPI側で実装）:**

```typescript
// 方法A: ホスティング環境のCSS制約を解除（推奨）
// html, body, #root に overflow:visible / height:auto を強制
const style = document.createElement('style');
style.textContent = `
  html, body, #root {
    overflow: visible !important;
    height: auto !important;
  }
`;
document.head.appendChild(style);

// 方法B: スクロールリスナーのターゲットを動的検出
function getScrollTarget(): HTMLElement | Window {
  const root = document.getElementById('root');
  if (root && root.scrollHeight > root.clientHeight) {
    return root; // #root内スクロール
  }
  return window; // 通常のwindowスクロール
}

const target = getScrollTarget();
target.addEventListener('scroll', handleScroll, { passive: true });

// progress計算も対応
function calculateProgress(container: HTMLElement, target: HTMLElement | Window): number {
  if (target === window) {
    const rect = container.getBoundingClientRect();
    const scrollableHeight = container.scrollHeight - window.innerHeight;
    return Math.max(0, Math.min(1, -rect.top / scrollableHeight));
  } else {
    const scrollTop = (target as HTMLElement).scrollTop;
    const scrollableHeight = container.scrollHeight - (target as HTMLElement).clientHeight;
    return Math.max(0, Math.min(1, scrollTop / scrollableHeight));
  }
}
```

---

### UI要素サイズ仕様

再現時は以下のサイズを正確に適用すること。サイズが小さいと安っぽく見える。

**デスクトップ（641px以上）:**

| 要素 | サイズ | 追加スタイル |
|------|--------|-------------|
| ドットナビ (pill dot) | 32px × 32px | 内部circle: 8px, active: 10px |
| 矢印ボタン (↑↓) | 52px × 52px | アイコン: 26px |
| 共有ボタン | 46px × 46px | アイコン: 20px |
| RESERVEボタン | padding 10px 18px | font-size: 10px, letter-spacing: 0.15em |
| ホットスポット "?" | 48px × 48px | font-size: 22px |
| ヘッダー店名 | font-size: 15px | letter-spacing: 0.15em |
| ヘッダーCredit | font-size: 9px | letter-spacing: 0.25em |

**モバイル（640px以下）:**

| 要素 | サイズ | 追加スタイル |
|------|--------|-------------|
| ドットナビ (pill dot) | 28px × 28px | 内部circle: 7px, active: 9px |
| 矢印ボタン (↑↓) | 44px × 44px | 位置: right-bottom |
| 共有ボタン | 38px × 38px | 位置: left-bottom |
| RESERVEボタン | padding 8px 14px | font-size: 9px |
| ホットスポット "?" | 52px × 52px | タッチターゲット拡大 |
| ヘッダー店名 | font-size: 13px | — |

**メタリック/ガラス質スタイル（全要素共通）:**

```css
/* エンクロージャー（外枠） */
background: rgba(255, 255, 255, 0.55);
backdrop-filter: blur(24px);
box-shadow:
  inset 0 1px 1px rgba(255, 255, 255, 0.8),
  inset 0 -1px 1px rgba(0, 0, 0, 0.05),
  0 4px 16px rgba(0, 0, 0, 0.12),
  0 1px 3px rgba(0, 0, 0, 0.08);
border: 1px solid rgba(255, 255, 255, 0.4);
border-radius: 適切な値;
```

---

### フレームアセット仕様

| 項目 | 値 | 備考 |
|------|-----|------|
| 解像度 | 720×1280 (ポートレート 9:16) | モバイルファースト |
| フォーマット | WebP | 軽量・高品質 |
| フレーム数 | 240枚 (8秒 × 30fps) | stride=2でモバイル最適化 |
| ファイル名規則 | `frame_001.webp` 〜 `frame_240.webp` | 連番 |
| 合計サイズ目安 | 15-25MB | WebP圧縮後 |

**モバイル最適化:**
- `stride=2`: モバイル（768px未満）では1フレームおきにロード（120枚）
- cover-fit描画: ポートレートフレームをランドスケープcanvasに描画する際は上下クロップ

---

### セールスKPI再現チェックリスト

- [ ] ヒーローは `<canvas>` + WebPフレーム方式で実装（`<video>` 不可）
- [ ] スクロールリスナーが正しく動作（`#root` overflow制約に対応）
- [ ] モバイルで黒幕なし（cover-fit描画確認）
- [ ] UI要素サイズが本家と一致（上記サイズ表参照）
- [ ] メタリック/ガラス質スタイルが正しく適用
- [ ] スクロール完了後のシーンモード遷移が動作
- [ ] スワイプ/ホイールでシーン間移動が動作
- [ ] ポップアップ自動再生が動作
- [ ] ローディング画面が表示される
