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
