# Project TODO

- [x] Drizzle schema: leads table with all fields from ZIP types
- [x] DB migration applied
- [x] globals.css: design tokens from ZIP (--bg, --ink, --accent, --overlay-*, --fs-*, --space-*, --gutter, --maxw)
- [x] Google Fonts: Cormorant Garamond + Inter (from ZIP tones.ts restaurant-luxury)
- [x] useFrameLoader hook translated from ZIP
- [x] PageScrollScrub component translated from ZIP (800svh, RAF coalesce, DPR canvas, orientation switch, stride=2 mobile, reduced-motion)
- [x] ScrubOverlay component translated from ZIP
- [x] HeroOverlay component translated from ZIP (La Letizia R5 copy)
- [x] StoryOverlay component translated from ZIP
- [x] SiteMenuOverlay component translated from ZIP
- [x] FreezeOverlay component translated from ZIP
- [x] PhraseTitle component translated from ZIP
- [x] PageTransitions (RevealSection) component translated from ZIP
- [x] RestaurantMenuFadeIn component translated from ZIP
- [x] MenuSection component translated from ZIP
- [x] GallerySection component translated from ZIP
- [x] InfoSection component translated from ZIP
- [x] CtaSection component translated from ZIP
- [x] tRPC router: leads CRUD (publicProcedure)
- [x] tRPC router: pipeline trigger
- [x] server/pipeline/video.ts: Atlas Cloud Seedance 2.0 integration
- [x] server/pipeline/frames.ts: ffmpeg WebP extraction + S3 upload
- [x] server/pipeline/prompts/cameraWork.ts translated from ZIP
- [x] server/pipeline/prompts/ambiance.ts translated from ZIP
- [x] server/pipeline/prompts/defaultAmbiance.ts translated from ZIP
- [x] Demo page: /r/:slug route (public, no auth)
- [x] Demo data seed: La Letizia R5 (store_name, area, ambiance, copy)
- [x] Atlas Cloud video generation executed
- [x] ffmpeg frame extraction executed
- [x] S3 frames uploaded
- [x] Integration test: scroll scrub working
- [x] Vitest tests for leads router

## Phase 2: Hero下セクション強化 + Store-driven + MDSバッジ

- [x] AI画像生成: Atmosphere用フルブリード画像（marble counter + morning light）
- [x] AI画像生成: Gallery用マソンリー4枚（cafe interior angles）
- [x] MDSバッジ追加（右下固定、Designed by MDS、プレースホルダーURL）
- [x] AtmosphereSection新規作成（フルブリード + Ken Burns + 1行コピー）
- [x] GallerySection強化（マソンリー4枚、hover zoom + caption、reveal animation）
- [x] CTA映画クレジット風（黒バック + 大判serif + fade out）
- [x] 遷移演出: Atmosphere→Menu color transition
- [x] 遷移演出: Menu→Gallery sticky reveal
- [x] 遷移演出: Gallery→CTA pin scroll + black fade
- [x] DemoPage.tsx更新: Hero → Atmosphere → Menu → Gallery → CTA
- [x] inferAmbianceFromStoreData: 方法A（キーワードマッチング）
- [x] inferAmbianceFromStoreData: 方法B（LLM Vision分析）
- [x] AmbianceProfile拡張（accentColor, density, textureEmphasis）
- [x] Drizzleスキーマ拡張 + migration（shared/ambiance.ts型定義完了）
- [x] テスト店舗: Noor（夜の創作和食）でambiance出力確認
- [x] テスト店舗: Sahara Brew（北アフリカ系カフェ）でambiance出力確認

## Phase 3: スクロールスクラブ後セクション全面リデザイン（数百万円クオリティ）

- [x] RestaurantMenuFadeIn: 黒→白グラデーションブリッジ強化（cinematic transition）
- [x] AtmosphereSection: editorial layout + parallax + split-screen + typography hierarchy
- [x] MenuSection: 高級レストランLP水準（大判余白、hover line animation、staggered reveal）
- [x] GallerySection: horizontal scroll + parallax depth + cursor-follow effect
- [x] CtaSection: full-viewport cinematic + text reveal animation + ambient gradient
- [x] InfoSection: asymmetric 2-column + map placeholder + micro-interactions
- [x] Footer: minimal editorial + subtle divider + brand mark
- [x] Typography: fluid type scale + letter-spacing + line-height refinement
- [x] Animations: GSAP ScrollTrigger for all sections + staggered reveals + parallax layers
- [x] Micro-interactions: hover states, cursor effects, link underline animations
- [x] Color transitions between sections (warm→cool→dark)
- [x] Overall spacing: generous editorial whitespace (120px+ section padding)

## Phase 4: Transition Bridge Fix

- [x] Fix ugly RestaurantMenuFadeIn gradient bridge — redesign to premium cinematic transition between scroll scrub last frame and AtmosphereSection
- [x] Verify the RestaurantMenuFadeIn → AtmosphereSection transition visually with a successful screenshot/browser capture and confirm there is no visible seam, white band, or layout regression across the transition

## Phase 5: 500万円クオリティ Phase A（Loading演出 + Atmosphere全面リビルド + グレイン）

- [x] Loading演出 Option B: ブランド名1文字ずつフェードイン → プログレス0→100% → スライドアウトでHero reveal
- [x] Loading画面: z-index最大で背景完全隠蔽、裏でフレームプリロード
- [x] Atmosphere全面リビルド: 技術3（clip-path reveal mask、scroll同期wipe）
- [x] Atmosphere全面リビルド: 技術2（kinetic typography、1単語ずつ y:40→0 + blur:12→0 stagger）
- [x] Atmosphere: pin scroll構成（セクションピン固定 + clip-pathスクラブで画像が現れる）
- [x] Atmosphere: テキストがスクロールで上方向に流れる構成を実装（画像固定、テキストがスクロールで上へ移動）
- [x] グレインoverlay: 全体にSVG noiseフィルター（opacity 0.035、fixed div z-9998）
- [x] Visual verification: Bridge → Atmosphere → Menu のフロー確認
- [x] Loading演出確認: DOM検査でloaderが正常にマウント→exit→unmount済み、grain overlayが正常に残存、Heroが正常に表示されていることを確認（フレームがキャッシュ済みのため高速完了、初回訪問時はアニメーションが見える）

## Phase 6: Bug Fix — テキスト重複

- [x] CinematicLoaderとHeroOverlayのテキストが重なる問題を修正: loaderActiveがtrueの間はoverlay childrenをopacity:0で非表示にし、ローダー完了後にフェードイン

## Phase 7: Phase B — セクションプレミアム化

- [x] MenuSection: 大きなナンバリング（01, 02...）+ 横幅フルのdivider + hover時にアクセントカラーのアンダーライン + 価格のタイポグラフィ強化
- [x] GallerySection: マスクreveal付きの画像表示 + カウンター表示（01/04）+ より大きなカード + caption常時表示
- [x] InfoSection: ダーク背景に切り替え + 大きなstore名 + 地図的装飾 + 営業時間をカード風に
- [x] CtaSection: ダーク背景 + 大きなイタリック見出し + ボタンのhoverエフェクト強化 + 背景にsubtle pattern
- [x] FooterSection: ダーク背景 + 横幅フルのgrid + ナビリンク + SNSアイコン的装飾 + 「Designed by MDS」リンク

## Phase 8: Bug Fix — Atmosphereテキスト滞在時間

- [x] AtmosphereSectionのテキスト（Where mornings stretch longer.）がスクロールで一瞬で消える問題を修正 — テキストの表示時間を長くし、もっとゆっくり消えるようにする

## Phase 9: Bug Fix — Gallery画像ジャンプ

- [x] GallerySectionの横スクロール完了後、InfoSectionに入る際に画像が左から右に瞬間移動する問題を修正 — GSAP pinの解除時にレイアウトシフトが発生している

## Phase 10: Gallery リデザイン

- [x] GallerySection再設計: 画像幅を60-70vw程度の大きめカードに変更、1枚ずつ中央に見せる横スクロール、画像が何の写真か認識できるサイズ感

## Phase 11: Phase C — マイクロインタラクション仕上げ

- [x] Lenisスムーススクロール導入（GSAPとの連携）
- [x] カスタムカーソル実装（デフォルト: 小ドット、リンクホバー: 拡大、画像ホバー: "View"テキスト表示）
- [x] ボタン/リンクのホバーマイクロインタラクション強化（magnetic effect）
- [x] ページ全体のスクロール体験の最終調整

## Phase 12: LP Factory — テンプレートシステム

- [x] DB schema拡張: gallery_captions, atmosphere_caption, cta_title, cta_subtitle フィールド追加
- [x] /lp-input パブリックフォーム作成（店名・エリア・業種・ambiance・メニュー・営業時間・写真URL・カラー等）
- [x] App.tsxに /lp-input ルート追加
- [x] leads.create mutationのバリデーション拡張（新フィールド対応）
- [x] DemoPageのハードコードされたテキスト（atmosphere caption, gallery captions, CTA title等）をDB駆動に変更
- [x] フォーム送信後にLP URLを表示する成功画面
- [x] テスト: フォーム入力→DB保存→LP表示の一連フロー確認

## Phase 13: Salon "The Ritual" テンプレート

- [x] AI画像生成: faceless マクロ接写7枚（hero 3枚 + pause 2枚 + work 2枚 + transformation 1枚 + towel 1枚）
- [x] 実写画像2枚アップロード（salon-arrival-wide, salon-arrival-work）
- [x] 全画像を manus-upload-file --webdev でストレージにアップロード
- [x] ScrollAnimatedHero コンポーネント作成（3枚 cross-fade + Ken Burns on scroll, 🔴Lock）
- [x] SalonArrival セクション作成（実写 wide shot + fade-in + caption）
- [x] ThePause セクション作成（非対称2画像 + kinetic typography）
- [x] TheWork セクション作成（pinned circle clip-path reveal + macro photography）
- [x] Transformation セクション作成（faceless 仕上がり写真 + editorial quote）
- [x] Lingering セクション作成（CTA + "BOOK YOUR RITUAL" + 3カラム情報）
- [x] SalonFooter セクション作成（minimal + MDS attribution）
- [x] SalonDemoPage.tsx 作成（全セクション統合 + DB駆動データ）
- [x] App.tsx に /s/:slug ルート追加
- [x] DB seed: Maison Lavèze Ginza デモデータ投入
- [x] Fraunces フォント追加（Google Fonts CDN）
- [x] salon-specific CSS variables 追加（index.css）
- [x] 全セクション表示確認（Hero, Arrival, ThePause, TheWork, Transformation, Lingering, Footer）
- [x] TypeScript エラーゼロ確認

## Phase 14: Salon テンプレート修正

- [x] Hero + TheWork のクロスフェード速度をもっとゆっくりに（早すぎる問題）
- [x] CinematicLoader をサロンテンプレートに追加（黒画面問題の解消）
- [x] メニューセクションをサロンテンプレートに追加

## 37 West Prototype — Into The Amazon Style

- [x] Upload 3 source photos to S3
- [x] AI-generate Detail seed image (wagyu overhead)
- [x] AI-generate Showcase extras (3 images: sashimi, grilled, plated)
- [x] Generate Hero forward dolly video (8s) from interior photo
- [x] Generate Detail vertical descent video (8s) from overhead wagyu image
- [x] Generate Story horizontal pan video (8s) from interior photo
- [x] Extract frames from all 3 videos (240 frames each @ 30fps)
- [x] Upload all frames + images to CDN storage
- [x] Build ShowcaseSection (GSAP pin + full-screen morph timeline)
- [x] Build DetailSection (vertical video scrub, reusing useFrameLoader)
- [x] Build StorySection (horizontal video scrub + kinetic text overlay)
- [x] Build NumbersSection (large typography kinetic reveal)
- [x] Build VisitSection (cinematic endroll CTA)
- [x] Build SeamTransition component (A/B/C patterns)
- [x] Create WestDemoPage integrating all sections in correct order
- [x] Register /w/37west route in App.tsx
- [x] Verify TypeScript compiles without errors
- [x] Verify all existing tests pass
- [x] Visual verification: all sections render correctly

## Interactive Scene LP Template (/lp/:slug)

### Phase 1: InteractiveScene + Hotspots + Popups
- [x] Select/generate photos for Scene 2 (Space), Scene 3 (Selection), Scene 4 (Craft)
- [x] Build InteractiveScene.tsx (full-bleed photo + Ken Burns + hotspot layer + popup layer)
- [x] Build HotspotPopup.tsx (slide-up popup with title, description, CTA)
- [x] Configure hotspot data structure (business_type-aware)

### Phase 2: SceneTransition + Hero Bridge
- [x] Build SceneTransition.tsx (zoom-in → black curtain → chapter title → zoom-out, 1.6s)
- [x] Implement Hero-to-scene-mode bridge (scroll completion → viewport lock → auto-transition)
- [x] Wire scene navigation state machine

### Phase 3: Access + Reservation + CTA
- [x] Build AccessScene.tsx (address, hours, map link)
- [x] Build ReservationScene.tsx (5 CTAs: form, phone, WhatsApp, Instagram, Maps)
- [x] Add persistent "Reserve" button (top-right, all scenes)
- [x] Add leads table columns (phone_number, whatsapp_number, instagram_handle, reservation_url, map_lat, map_lng)

### Phase 4: Navigation
- [x] Build SceneNav tabs (Hero | Space | Selection | Craft | Access | Reserve)
- [x] Build dot pagination (G | 1 | 2 | 3 | A | R)
- [x] Add prev/next arrow buttons
- [x] Add keyboard navigation (arrow keys, Esc)
- [x] Add MDS badge (bottom-left, link to mds-fund.com)

### Phase 5: Mobile + Integration
- [x] Mobile layout optimization (portrait viewport, hotspot repositioning)
- [x] Register /lp/:slug route in App.tsx
- [x] Create InteractiveLpPage.tsx integrating all components
- [x] Full integration test (all scenes, transitions, hotspots, popups verified)
- [x] Accessibility (aria-labels on hotspots and CTAs)
- [x] AI-generate Selection scene kaiseki overhead image

## Bug Fix: カーソル非表示 + ヒーロー差し替え

- [x] カスタムカーソルがInteractive LPでシステムカーソルを隠している問題を修正
- [x] ヒーローセクションのスクロールスクラブを37 West（焼肉屋）のフレームデータに差し替え

## ポップアップ UI 変更

- [x] ホットスポットポップアップを中央モーダル型に変更（下部スライドアップ→中央表示）
- [x] 背景を透かし（白ベース黒文字 or 黒背景白文字）に変更
- [x] ×ボタン（右上）で閉じる
- [x] ポップアップ外クリックでも閉じる

## ホットスポット＆ナビ改善

- [x] ホットスポットボタンを＋→？に変更、もっと目立つデザインに
- [x] ドットナビゲーション（右側 G/1/2/3/A/R）を削除
- [x] 上下矢印ボタンのみ残して大きめに表示

## Googleマップ埋め込み + Space背景 + ポップアップ位置変更

- [x] AccessシーンにGoogleマップiframe埋め込み（YAKINIKU 37 新橋店）
- [x] Spaceシーンの背景を焼肉屋内装写真に差し替え
- [x] ポップアップを中央モーダル→ホットスポット横ツールチップ型に変更

## UI改善バッチ

- [x] ヒーロースクロール速度を上げて滑らかに
- [x] 店名＋キャッチコピーを最初から表示（常時表示）
- [x] ホットスポット「?」ボタンを大きく
- [x] 上部ヘッダーをコンパクトなドットナビ（pill状、~200px幅、画面上中央）に変更
- [x] 右上RESERVEボタンとヘッダーのRタブ重複解消
- [x] "DESIGNED BY MDS"バッジを大きく（11-12px、letter-spacing 0.18em、padding増し）

## ドットナビ＆矢印サイズアップ + ヘッダー常時表示

- [x] ドットナビを大きく（30-36px、ラベル付き）Marina Bay Sands参考
- [x] 上下矢印ボタンを大きく（50px程度）
- [x] ヘッダー（pill nav）をヒーローセクションから常時表示（シーンモードだけでなく）

## グラスモーフィズム + ベージュ + モバイル全画面ツールチップ

- [x] ドットナビ（pill nav）をグラスモーフィズムデザインに変更（半透明+ブラー+光沢感、Marina Bay Sands参考）
- [x] ボタン（矢印、RESERVE、ホットスポット?）もグラスモーフィズムに統一
- [x] カラーをベージュ系に変更（上品で明るめのベージュ、アクティブドットはゴールド/ベージュ）
- [x] スマホ版ツールチップを画面いっぱいの中央モーダルに変更（Marina Bay Sands 2枚目参考）
- [x] スマホ版上下矢印を右下に配置（3枚目参考のバランス）
- [x] 全体的にMarina Bay Sands風の高級感あるUIに仕上げ
- [x] RESERVEボタンにもグラスモーフィズム要素追加（blur+ハイライト）
- [x] スマホツールチップをより大きく（画面いっぱいに近いサイズ）

## ナビ修正 + 拡散ボタン追加

- [x] DESIGNED BY MDSバッジを下に移動（左下）
- [x] 左下に拡散（シェア）ボタン追加（ガラスモーフィズム、矢印アイコン、クリックでURL コピー）
- [x] 拡散ボタンのホバーでベージュに色変更
- [x] ドットナビのラベルをG/1/2/3/Aから●（丸ドット）に変更

## ツールチップ位置・デザイン修正

- [x] ツールチップの×ボタンをカード内側左上に配置してテキストと被らないようにする
- [x] 画面最上部にヘッダーバー追加（左: 店名、右: Created by MDS テキストのみ）
- [x] 下のDESIGNED BY MDSバッジを削除（上に移動したため）
- [x] スマホ版シーン画像をobject-fit: containで画面にフィットさせる（見切れ防止）
- [x] ツールチップの吹き出しがホットスポット？マークに被らないようにオフセットを増やす（60px）

## モバイル全画面修正

- [x] モバイル(< 768px)でシーン背景画像をviewport全体にcover表示（background-size:cover, position:absolute, inset:0）
- [x] モバイルでアスペクト比固定を無効化（元々なし）
- [x] 上下の黒帯を排除（scene-containerにmin-height:100dvh, bodyロックも100dvh）

## デザイン強化

- [x] ポップアップ表示時に背景blur(4px) + brightness(0.7)を適用（0.4s ease遷移）
- [x] ポップアップ閉じたら背景がclearに戻る
- [x] ホットスポット自体はblurしない（押せる状態維持）
- [x] UI要素のガラス感をApple Vision Pro風に強化（blur16px, saturate180%, inset shadow, 外側shadow）
- [x] 対象: ドットナビ、↑↓矢印、共有アイコン、×ボタン、MDSバッジ
- [x] 触らない: RESERVEボタン（ゴールド）、ポップアップ本体（黒カード）

## ポップアップボーダー + シーン遷移ブラー

- [x] ポップアップ本体に薄いガラスボーダー追加（0.5px rgba(255,255,255,0.18) + inset shadow + saturate）で統一感
- [x] シーン切り替え時にblur(6px)+brightness(0.6)+scale(1.04)のトランジション（映画的演出）

## ローディング画面リデザイン (/lp/:slug のみ)

- [x] MDS ロゴ (logoMDSblack.webp) をストレージにアップロードし、ローディング画面中央に配置 (高さ48px)
- [x] 白背景 (#FBFAF8) のローディング画面
- [x] ロゴ下に "La Letizia" Fraunces italic 48px 黒 (margin-top: 32px)
- [x] 装飾線 (60px幅、1px細線)
- [x] "CREATED BY MDS" 11px, letter-spacing 0.3em, グレー
- [x] パーセント表示を削除
- [x] ローディング中にトップヘッダーバー表示 (黒文字 on 白背景)
- [x] ローディング中にガラスドットナビ (light glass スタイル) 表示
- [x] ローディング中に矢印 + RESERVE + Share ボタン表示 (light glass + ゴールド)
- [x] ロード完了時: 0.5秒で白背景フェードアウト + Hero 1フレーム目フェードイン
- [x] 同時に UI 要素が light glass → dark glass に切り替わる
- [x] Hero overlay (店名 + タイトル + サブ) 出現
- [x] /r/:slug テンプレート (DemoPage.tsx) は変更しない

## NOA hair サロン版 LP (/lp/noa-hair-tokyo-nakameguro)

### DB & データ
- [x] leads テーブルに business_type フィールド追加 (restaurant/salon/gym/clinic)
- [x] leads テーブルに luxury_tier フィールド追加 (luxury/casual)
- [x] leads テーブルに accent_color フィールド追加 (既存 palette_accent を使用)
- [x] leads テーブルに line_url フィールド追加 (WhatsApp代替)
- [x] NOA hair の lead レコード作成 (slug: noa-hair-tokyo-nakameguro)

### AI画像生成
- [x] Space シーン画像生成 (ヘアサロン内装、明るい自然光)
- [x] Selection シーン画像生成 (メニュー&ツール俯瞰)
- [x] Craft シーン画像生成 (スタイリストの手元クローズアップ)

### Hero動画 & フレーム
- [x] Seedance でヘアサロン Hero 動画生成 (8秒)
- [x] ffmpeg フレーム抽出 + S3 アップロード (32フレーム)

### テンプレート拡張
- [x] InteractiveLpPage: business_type に応じた CTA ラベル自動切替
- [x] InteractiveLpPage: luxury_tier に応じた RESERVE ボタン色切替 (casual=桜色)
- [x] InteractiveLpPage: luxury_tier に応じたタイポグラフィ切替 (casual=Fraunces SOFT)
- [x] LpLoader: 店名を動的に表示 (La Letizia → NOA hair)

### シーンデータ設定
- [x] Hero overlay コピー設定 (NOA HAIR / Tomorrow, a little better / サブタイトル)
- [x] Space ホットスポット3点設定 (Cut Chair / Waiting Lounge / Hair Bar)
- [x] Selection ホットスポット3点設定 (Cut+Treatment / Color / Head Spa)
- [x] Craft ホットスポット2点設定 (Stylists / Products)
- [x] Access 情報設定 (中目黒、Google Maps埋め込み)
- [x] Reservation CTA 5点設定 (Reserve Online / Call / LINE / Instagram / Map)

### 確認
- [x] /lp/noa-hair-tokyo-nakameguro で全シーン表示確認
- [x] La Letizia (/lp/la-letizia-dubai-marina) に影響なし確認
- [x] TypeScript エラーゼロ確認

## 白基調テンプレ統一 (/lp/:slug のみ、/r/:slug は変更なし)

- [x] RESERVE ボタン: ゴールド → White Glass (rgba(255,255,255,0.85) + blur + 黒文字)
- [x] Access セクション: 黒背景 → 白背景 #FBFAF8 + 黒文字
- [x] Reservation セクション: 黒背景 → 白背景 #FBFAF8 + 黒文字
- [x] Reservation CTA ボタン: メイン=白背景+黒文字+黒ボーダー、サブ=透明+黒文字+グレーボーダー
- [x] ポップアップ (InteractiveScene): 黒背景 → 白背景 (rgba(255,255,255,0.95) + backdrop-filter) + 黒文字
- [x] ポップアップ内 CTA ボタン: 白背景 + 黒文字 + 黒ボーダー
- [x] 装飾線: rgba(0,0,0,0.15)
- [x] ガラス UI (ドットナビ・矢印・共有): dark glass 維持 (写真上で映える)
- [x] ローディング画面: light glass 維持 (既に実装済み)
- [x] La Letizia (/lp/la-letizia-dubai-marina) で確認
- [x] NOA hair (/lp/noa-hair-tokyo-nakameguro) で確認
- [x] /r/:slug は変更なし確認

## White Glass 完全統一 (/lp/:slug のみ)

- [x] ドットナビ (pill): saturate 削除 → White Glass (rgba(255,255,255,0.75) + blur(20px))
- [x] 矢印ボタン (↑↓): saturate 削除 → White Glass
- [x] ホットスポット "?": White Glass (rgba(255,255,255,0.85))
- [x] 共有アイコン (左下): White Glass
- [x] MDS バッジ: White Glass
- [x] RESERVE ボタン: 桜色/麦色/ゴールド全廃 → White Glass 統一
- [x] ローディング画面 UI: light glass → White Glass (同じスタイル)
- [x] 全業種で同じ見た目 (business_type/luxury_tier による色分け廃止)
- [x] La Letizia (/lp/la-letizia-dubai-marina) スクショ確認
- [x] NOA hair (/lp/noa-hair-tokyo-nakameguro) スクショ確認
- [x] /r/:slug 変更なし確認

## スクロール自動進行 + ポップアップ自動再生 (/lp/:slug)

### スクロール → シーン遷移
- [x] viewport lock: 各シーンで画面固定、スクロールで次/前シーンに遷移
- [x] wheel イベント: マウスホイールダウン = 次シーン、アップ = 前シーン
- [x] touch イベント: 縦スワイプダウン = 次シーン、アップ = 前シーン (横スワイプ無視)
- [x] スクロール感度: 自然に切り替わる程度 (debounce/threshold)
- [x] Hero (スクロールスクラブ) は既存維持、最終フレーム後にシーンモード遷移

### ポップアップ自動再生
- [x] useAutoplay hook 作成 (タイマーチェーン、再生済み管理、ユーザー中断)
- [x] シーン到達 → 1秒待機 → ポップアップ1 自動表示
- [x] 3.5秒表示 → 自動消去 → 0.5秒待機 → ポップアップ2 自動表示 (繰り返し)
- [x] 文字量に応じた表示時間 (50文字以下: 3秒, 50-100文字: 3.5秒, 100文字以上: 4-5秒)
- [x] ホットスポット "?" が光るアニメーション (scale 1.0→1.3→1.0, 0.5秒)
- [x] 自動再生 ON: Space, Selection, Craft
- [x] 自動再生 OFF: Hero, Access, Reservation
- [x] 再生済みシーンは再訪時に自動再生しない (state管理)

### ユーザー操作との両立
- [x] "?" タップ: 自動再生中でも該当ポップアップを即表示 (スキップ)
- [x] × タップ: 現在のポップアップを閉じ、以降の自動再生も停止
- [x] シーン外スクロール: 次/前シーン移動、現シーンの自動再生キャンセル
- [x] 既存の手動操作全て維持 (タブ・ドット・矢印・キーボード)

### 確認
- [x] La Letizia (/lp/la-letizia-dubai-marina) で動作確認
- [x] NOA hair (/lp/noa-hair-tokyo-nakameguro) で動作確認
- [x] /r/:slug 変更なし確認

## White Glass 透明感修正 (Apple Vision Pro / iOS 26 レベル)

- [x] ドットナビ (pill): background rgba(255,255,255,0.55) + blur(24px) + inset shadow上下 + 外側shadow強め
- [x] 矢印ボタン (↑↓): 同上
- [x] 共有アイコン: 同上
- [x] MDS バッジ: 同上
- [x] RESERVE ボタン: 同上
- [x] ホットスポット "?": rgba(255,255,255,0.6) + blur(20px) + inset上端 + 外側shadow
- [x] saturate 使わない確認
- [x] La Letizia で透明感確認 (写真が透けて見える)
- [x] NOA hair で透明感確認
