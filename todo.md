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
