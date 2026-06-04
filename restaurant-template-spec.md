# Restaurant Template (`scroll_scrub`) — Complete Specification

> **Project**: `la-letizia-lp`  
> **Stack**: React 19 + TypeScript + Tailwind 4 + Express 4 + tRPC 11 + Drizzle ORM (MySQL/TiDB)  
> **Animation**: GSAP + ScrollTrigger + Lenis (smooth scroll) + Canvas API (frame scrubbing)  
> **Video**: Atlas Cloud Seedance 2.0 API → ffmpeg → WebP frames → Manus Forge Storage (S3)  
> **Route**: `/r/:slug`  
> **Last updated**: 2026-06-04

---

## 1. Architecture Overview

The restaurant template (`scroll_scrub`) is a cinematic, scroll-driven landing page that uses a pre-generated AI video decomposed into 241 WebP frames. The user scrolls through 800svh of vertical space while a `<canvas>` element draws the corresponding frame, creating a "video scrub" effect. Below the scrub hero, traditional sections (menu, gallery, info, CTA, footer) render with GSAP-powered scroll choreography.

### Section Flow

| # | Section | Component | Scroll Height | Background | Animation |
|---|---------|-----------|---------------|------------|-----------|
| 01 | Arrival (Hero) | `PageScrollScrub` | 800svh | Dark (video frames) | Canvas frame scrub |
| — | Bridge | `RestaurantMenuFadeIn` | 40–60vh | `#0E0D0C` | Fade-in text |
| 02 | Atmosphere | `AtmosphereSection` | 320vh | `#0E0D0C` | Clip-path reveal + kinetic text |
| 03 | Menu | `MenuSection` | auto | `--bg` (#FBFAF8) | Stagger list |
| 04 | Gallery | `GallerySection` | pinned | `#0E0D0C` | Horizontal pin scroll |
| 05 | Info | `InfoSection` | auto | `#0E0D0C` | Reveal + stagger |
| 06 | CTA | `CtaSection` | auto | `#0E0D0C` | Reveal |
| 07 | Footer | `FooterSection` | auto | `#0E0D0C` | Static |

### Fixed/Global Elements

| Component | Role |
|-----------|------|
| `CinematicLoader` | Full-screen loading overlay with brand name letter stagger + progress counter |
| `SmoothScroll` | Lenis smooth scroll wrapper integrated with GSAP ScrollTrigger |
| `CustomCursor` | Context-aware cursor (dot/ring/view) with mix-blend-difference |
| `PageTransitions` | Global GSAP ScrollTrigger choreography for `[data-reveal]`, `[data-stagger-list]`, etc. |
| `MdsBadge` | Fixed bottom-right "Designed by MDS" badge linking to `https://mds-fund.com` |
| Grain overlay | Fixed SVG noise filter at z-9998, opacity 0.035, mix-blend-mode: overlay |

---

## 2. Page Orchestrator — `DemoPage.tsx`

The `DemoPage` component is the top-level orchestrator. It fetches lead data from the database via tRPC (`trpc.leads.getBySlug`), resolves all content slots, and renders the section tree.

### Data Flow

```
URL /r/:slug → DemoPage → trpc.leads.getBySlug(slug) → Lead row → Render sections
```

### Key Logic

1. **Frame source resolution**: Checks `frameUrlsLandscape` (array of URLs) first, falls back to `framesPathLandscape` (base path prefix). Portrait variants used on mobile (`window.innerWidth < 768`).
2. **Loader state**: `loaderDismissed` state gates overlay visibility via `loaderActive` prop on `PageScrollScrub`.
3. **Gallery items**: Combines `galleryImages` and `galleryCaptions` arrays into `{imageUrl, caption}` objects.
4. **Nav links**: Statically defined section anchors (`#menu`, `#gallery`, `#info`, `#cta`).

### Props Passed to Sections

```typescript
// PageScrollScrub
framesPath?: string;          // URL prefix for sequential frame loading
frameUrls?: string[];         // Array of exact frame URLs (preferred)
frameCount: number;           // Total frames (241 for 8s @ 30fps)
framesPathPortrait?: string;  // Portrait variant base path
frameUrlsPortrait?: string[]; // Portrait variant URLs
frameCountPortrait?: number;  // Portrait frame count
loaderActive: boolean;        // Hides overlay children while true
renderLoader: (progress, ready) => ReactNode;

// AtmosphereSection
imageUrl: string;             // First gallery image or source photo
caption: string;              // atmosphereCaption field

// MenuSection
items: Array<{ name: string; desc?: string; price?: string }>;

// GallerySection
items: Array<{ imageUrl: string; caption?: string }>;

// InfoSection
storeName, area, address, hours, phone, reservationUrl

// CtaSection
title, subtitle, ctas: Array<{ label, href, variant }>

// FooterSection
storeName
```

---

## 3. Core Component — `PageScrollScrub.tsx`

The heart of the template. A tall container (800svh) with a sticky `<canvas>` viewport (100svh) that draws video frames based on scroll position.

### Architecture

```
┌─────────────────────────────────────────┐
│ Container (800svh, relative)            │
│  ┌──────────────────────────────────┐   │
│  │ Sticky viewport (100svh, top: 0) │   │
│  │  ┌──────────────────────────┐    │   │
│  │  │ <canvas> (cover-fit)     │    │   │
│  │  └──────────────────────────┘    │   │
│  │  [Loading indicator / Loader]    │   │
│  └──────────────────────────────────┘   │
│  [Overlay children — positioned via     │
│   topSvh/heightSvh within 800svh]       │
└─────────────────────────────────────────┘
```

### Props Interface

```typescript
interface PageScrollScrubProps {
  framesPath?: string;
  frameUrls?: string[];
  frameCount: number;
  framesPathPortrait?: string;
  frameUrlsPortrait?: string[];
  frameCountPortrait?: number;
  loaderActive?: boolean;
  renderLoader?: (progress: number, ready: boolean) => ReactNode;
  children?: ReactNode;
}
```

### Scroll → Frame Mapping

```typescript
// Scroll progress calculation
const scrollableHeight = container.scrollHeight - window.innerHeight;
const scrolled = -rect.top;
const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

// Frame selection
const idx = Math.round(progress * (frames.length - 1));
```

### Cover-Fit Drawing

The canvas uses a cover-fit algorithm: calculates source crop rectangle to maintain aspect ratio while filling the entire canvas, then draws with `ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw*dpr, ch*dpr)`.

### Performance

- **RAF coalescing**: Only one `requestAnimationFrame` callback active at a time.
- **Progress threshold**: Skips redraw if `|progress - lastProgress| < 0.001`.
- **DPR-aware**: Canvas buffer sized at `clientWidth * devicePixelRatio`.
- **Stride**: Mobile loads every 2nd frame (`stride=2`), desktop loads all (`stride=1`).

---

## 4. Frame Loading — `useFrameLoader.ts`

A React hook that preloads WebP frames and exposes a progress-aware getter.

### Two Modes

| Mode | Input | URL Pattern |
|------|-------|-------------|
| `basePath` | URL prefix + `frameCount` | `{basePath}{0001}.webp`, `{0002}.webp`, ... |
| `frameUrls` | Array of exact URLs | Direct URLs from S3 storage |

### Interface

```typescript
interface FrameLoaderOptions {
  basePath?: string;
  frameUrls?: string[];
  frameCount: number;
  stride?: number;  // 1 = all frames, 2 = every other frame
}

interface FrameLoader {
  progress: number;           // 0–1 loading progress
  ready: boolean;             // true when all frames loaded
  getFrameAt: (progress: number) => HTMLImageElement | null;
}
```

### Nearest-Frame Search

When the exact frame index is not loaded (due to stride), the hook searches outward from the target index for the nearest available frame:

```typescript
for (let offset = 1; offset < frames.length; offset++) {
  if (idx + offset < frames.length && frames[idx + offset]) return frames[idx + offset];
  if (idx - offset >= 0 && frames[idx - offset]) return frames[idx - offset];
}
```

---

## 5. Overlay System

Overlays are positioned within the 800svh scroll container using `topSvh` and `heightSvh` props. They appear at specific scroll positions corresponding to frame ranges.

### `ScrubOverlay.tsx` (Base Wrapper)

```typescript
interface ScrubOverlayProps {
  id: string;
  topSvh: number;      // Position from top of 800svh container
  heightSvh: number;   // Height in svh units
  align: 'left' | 'right' | 'center';
  gradient?: boolean;  // Show dark gradient overlay (default: true)
  children: ReactNode;
}
```

Renders a `position: absolute` div at `top: {topSvh}svh; height: {heightSvh}svh` with a sticky inner viewport (100svh) for content alignment.

### Overlay Schedule

| Overlay | topSvh | heightSvh | Frame Range | Alignment | Content |
|---------|--------|-----------|-------------|-----------|---------|
| `HeroOverlay` | 0 | 250 | 0–75 | center | Store name + tagline |
| `StoryOverlay` | 250 | 200 | 75–150 | left | Story paragraphs |
| `SiteMenuOverlay` | 450 | 200 | 135–210 | right | Numbered nav links |
| `FreezeOverlay` | 650 | 150 | 195–241 | center | "A taste of what awaits" |

### HeroOverlay Content

```
[Eyebrow: store name, uppercase, --fs-eyebrow, letter-spacing 0.32em]
[Title: heroTagline, --font-heading, italic, weight 300, --fs-hero]
[Subtitle: heroSubtitle, --font-body, --fs-body, max-width 38ch]
```

### SiteMenuOverlay Content

Numbered navigation links (01, 02, 03...) with hover underline animation. Each link uses `--font-heading` at `clamp(28px, 4.2vw, 56px)`.

---

## 6. Bridge — `RestaurantMenuFadeIn.tsx`

A cinematic breathing-room transition between the dark scroll-scrub hero and the AtmosphereSection. Height: `clamp(40vh, 50vh, 60vh)`. Pure dark background (`#0E0D0C`) with:

- Top gradient blending from video tones into solid black
- Subtle noise texture (opacity 0.025)
- Centered "Discover" text with decorative vertical line above
- GSAP fade-in animation triggered at `top 50%`

---

## 7. Atmosphere Section — `AtmosphereSection.tsx`

An immersive pinned-image section with clip-path reveal and kinetic typography.

### Architecture

- **Outer wrapper**: 320vh tall (scroll runway)
- **Sticky image layer**: Fixed at top (100svh) while user scrolls
- **Clip-path reveal**: Image wipes in from bottom via `inset(100% 0 0 0)` → `inset(0% 0 0 0)`, scrub-linked
- **Text layer**: Kinetic word-by-word stagger with blur + y offset
- **Exit animation**: Text fades out at scroll end

### GSAP Timeline

| Phase | Scroll Range | Animation |
|-------|-------------|-----------|
| Image reveal | top 20% → top -40% | clip-path scrub |
| Image parallax | top bottom → bottom top | subtle y drift |
| Text appear | top -20% → top -60% | word stagger (opacity + y + blur) |
| Text exit | top -120% → top -180% | opacity 0, y -40 |

---

## 8. Menu Section — `MenuSection.tsx`

White background (`--bg`) editorial menu list with:

- Eyebrow ("Selection") + PhraseTitle heading
- `[data-stagger-list]` container for GSAP stagger animation
- Each item: editorial numbering (01, 02...), name in `--font-heading` italic, description, price
- Hover effects: left accent line (scaleY reveal), name translateX, price color change

### Item Grid

```
[Number (5vw)] [Name + Description (1fr)] [Price (auto)]
```

---

## 9. Gallery Section — `GallerySection.tsx`

Dark background horizontal pin-scroll gallery.

### Architecture

- `[data-horizontal-scroll]` outer section (100vh, overflow hidden)
- `[data-horizontal-inner]` flex row with large cards (50–65vw width)
- GSAP ScrollTrigger pins the section and translates inner horizontally
- Fade-out at 85% scroll progress for seamless transition to next section

### Card Design

- Large images with `object-fit: cover`
- Counter badge (01, 02...) top-left
- Caption below image
- Hover: subtle scale(1.02) on image
- Staggered heights for visual rhythm

---

## 10. Info Section — `InfoSection.tsx`

Dark background (`#0E0D0C`) two-column editorial layout:

- Left: Store name heading + area
- Right: Card-style blocks for hours and location
- Links with arrow hover animation
- `[data-reveal]` and `[data-stagger-list]` attributes for scroll choreography

---

## 11. CTA Section — `CtaSection.tsx`

Dark background call-to-action with:

- Large italic heading (`--font-heading`, `--fs-h2`)
- Subtitle text
- Pill-shaped buttons with hover glow effect (radial gradient)
- Primary variant: filled, Secondary variant: outlined
- `[data-reveal]` for scroll animation

---

## 12. Footer Section — `FooterSection.tsx`

Minimal dark footer with:

- 12-column grid: store name (5 cols), nav links (4 cols), year (3 cols)
- `MagneticButton` wrapper on nav links
- Bottom attribution: "Designed by MDS" link
- Hairline top border (`rgba(242, 238, 232, 0.06)`)

---

## 13. Global Utilities

### `SmoothScroll.tsx`

Initializes Lenis smooth scroll and integrates with GSAP ScrollTrigger:

```typescript
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### `PageTransitions.tsx`

Global scroll choreography engine. Applies GSAP animations to elements with data attributes:

| Attribute | Animation |
|-----------|-----------|
| `[data-reveal]` | opacity 0→1, y 40→0, duration 0.9 |
| `[data-paragraph]` | opacity 0→1, duration 1.2 |
| `[data-stagger-list]` | children: opacity 0→1, y 24→0, stagger 0.07 |
| `[data-parallax]` | y 30→-30, scrub (desktop only) |
| `[data-scale-in]` | opacity 0→1, scale 0.92→1 |
| `[data-horizontal-scroll]` | pin + translateX, fade at 85% |

### `CustomCursor.tsx`

Three states based on hovered element:

| State | Trigger | Size | Style |
|-------|---------|------|-------|
| Default | Nothing hovered | 8px | White dot |
| Link | `a`, `button`, `[data-cursor-hover]` | 40px | Transparent ring |
| View | `[data-cursor-view]`, `.gallery-card` | 80px | Ring + "View" text |

Uses GSAP ticker for 60fps tracking. Hidden on touch devices. `mix-blend-difference` for visibility on any background.

### `MagneticButton.tsx`

GSAP-powered magnetic hover effect. Elements follow cursor within their bounds:

```typescript
// On mouse move: translate toward cursor
gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out' });
// On mouse leave: elastic snap back
gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
```

### `CinematicLoader.tsx`

Full-screen loading overlay:

1. Brand name letters stagger in (GSAP fromTo: opacity 0→1, y 20→0, rotateX -40→0)
2. Decorative line scales in
3. Progress counter (0% → 100%) with tabular-nums
4. On ready: 600ms hold, then slide-up exit (y: -100%, duration 0.8)
5. Calls `onComplete` callback to dismiss

---

## 14. Video Generation Pipeline

### Flow

```
Lead created → runPipeline(leadId)
  → Resolve ambiance (explicit → inferred → template default)
  → Build prompt (camera work + ambiance phrases)
  → Generate video (Atlas Cloud Seedance 2.0)
  → Extract frames (ffmpeg → WebP)
  → Upload frames (S3)
  → Update lead (frameUrls, frameCount, status: READY)
```

### `server/pipeline/index.ts` — Orchestrator

Coordinates the full pipeline. Updates lead status at each stage:

| Status | Meaning |
|--------|---------|
| `NEW_LEAD` | Just created, pipeline not started |
| `GENERATING_VIDEO` | Seedance API call in progress |
| `EXTRACTING_FRAMES` | ffmpeg + S3 upload in progress |
| `READY` | All frames uploaded, LP viewable |
| `PIPELINE_FAILED` | Error at any stage |

### `server/pipeline/video.ts` — Seedance API

Calls Atlas Cloud Seedance 2.0 API for video generation:

```typescript
interface VideoGenerationOptions {
  prompt: string;
  duration: number;      // 8 seconds
  ratio: string;         // '16:9'
  resolution: string;    // '720p'
  generateAudio: boolean; // false
  watermark: boolean;     // false
  seed: number;           // 12345
}
```

- **Cost**: ~$0.386 per video (8 seconds)
- **Output**: 8-second MP4 video URL
- **Polling**: Checks task status every 10 seconds until complete

### `server/pipeline/frames.ts` — Frame Extraction

```typescript
interface FrameExtractionOptions {
  videoSource: string;    // URL or local path
  slug: string;           // For storage path organization
  fps: number;            // 30
  width: number;          // 1280
  height: number;         // 720
  pathSuffix: string;     // 'landscape' or 'portrait'
}
```

Process:
1. Download video to temp directory
2. Run ffmpeg: `ffmpeg -i input.mp4 -vf fps=30,scale=1280:720 -c:v libwebp -quality 90 %04d.webp`
3. Upload all WebP files to S3 with concurrency limit of 8
4. Return array of public URLs

**Output**: 241 frames (30fps × 8s + 1), each ~1280×720 WebP at quality 90.

---

## 15. Ambiance System

The ambiance system determines the visual mood of generated videos. It uses a 3-tier priority resolution:

### Priority Chain

1. **Explicit fields** — Set manually by operator in lead record
2. **Inferred** — Vision AI analysis of store photos + keyword extraction from notes/area
3. **Template default** — Fallback based on template type + business subtype

### Ambiance Profile

```typescript
interface AmbianceProfile {
  lighting: AmbianceLighting;
  surfaces: AmbianceSurfaces;
  colorPalette: AmbianceColorPalette;
  mood: AmbianceMood;
  timeOfDay: AmbianceTimeOfDay;
  accentColor?: string;
  customNotes?: string;
}
```

### Lighting Options

| Value | Phrase |
|-------|--------|
| `warm_golden` | warm golden-lit |
| `cool_neutral` | cool neutral-lit |
| `dim_moody` | dim and moody |
| `bright_airy` | bright and airy |
| `natural_daylight` | natural daylight-filled |
| `candlelit` | candlelit |
| `neon_accent` | neon-accented |
| `soft_diffused` | soft diffused |

### Surfaces Options

| Value | Phrase |
|-------|--------|
| `marble` | polished marble surfaces |
| `wood` | warm wood surfaces |
| `concrete` | raw concrete and industrial materials |
| `leather_velvet` | leather and velvet upholstery |
| `glass_metal` | glass and brushed metal |
| `ceramic_tile` | ceramic tile |
| `mixed_modern` | mixed modern materials |
| `natural_stone` | natural stone |

### Color Palette Options

| Value | Phrase |
|-------|--------|
| `cool_neutral` | cool neutral |
| `warm_earth` | warm earth tones |
| `monochrome_dark` | monochrome dark |
| `jewel_tones` | rich jewel tones |
| `earthy_natural` | earthy natural |
| `earthy_terracotta` | earthy terracotta and sand tones |
| `pastel_soft` | soft pastel |
| `bold_vibrant` | bold vibrant |
| `natural_color` | natural true-to-life colors |
| `breeze_blue` | coastal blue and white |
| `soft_green` | soft botanical green |

### Mood Options

| Value | Phrase |
|-------|--------|
| `intimate_upscale` | intimate upscale |
| `bright_casual` | bright casual |
| `cozy_warm` | cozy and warm |
| `clinical_clean` | clinical and pristine |
| `energetic_modern` | energetic and modern |
| `refined_minimal` | refined and minimal |
| `refined` | refined and elegant |
| `editorial_minimal` | editorial and minimal |
| `speakeasy_moody` | speakeasy moody |

### Template Defaults

| Template | Lighting | Surfaces | Palette | Mood | Time |
|----------|----------|----------|---------|------|------|
| `restaurant` | cool_neutral | marble | cool_neutral | refined_minimal | evening |
| `restaurant-luxury` | dim_moody | marble | monochrome_dark | intimate_upscale | evening |
| `restaurant-casual` | natural_daylight | wood | earthy_natural | bright_casual | midday |
| `salon` | soft_diffused | glass_metal | cool_neutral | editorial_minimal | morning |

### Subtype Overrides (Restaurant Family)

| Subtype | Override Fields |
|---------|----------------|
| `cafe` | lighting: natural_daylight, surfaces: wood, mood: bright_casual, timeOfDay: morning |
| `fine_dining` | lighting: dim_moody, surfaces: marble, colorPalette: monochrome_dark, mood: intimate_upscale |
| `izakaya` | lighting: warm_golden, surfaces: wood, mood: cozy_warm, timeOfDay: night |
| `yakiniku` | lighting: warm_golden, surfaces: wood, colorPalette: warm_earth, mood: energetic_modern |
| `ramen` | lighting: warm_golden, surfaces: wood, mood: energetic_modern |
| `italian` | lighting: warm_golden, surfaces: wood, colorPalette: earthy_terracotta, mood: cozy_warm |
| `bar` | lighting: dim_moody, surfaces: leather_velvet, colorPalette: jewel_tones, mood: speakeasy_moody, timeOfDay: night |
| `burger` | lighting: natural_daylight, surfaces: wood, colorPalette: earthy_natural, mood: bright_casual, timeOfDay: midday |
| `vegan` | lighting: bright_airy, surfaces: wood, colorPalette: earthy_natural, mood: cozy_warm, timeOfDay: midday |

### Camera Work Prompts

| Business Type | Subtype | Camera Description |
|---------------|---------|-------------------|
| restaurant | (default) | Slow forward dolly at eye level, moving through the dining space toward the back. Steady horizontal movement with subtle parallax. |
| restaurant | cafe | Slow forward dolly at eye level, gliding past the marble counter toward a window seat. |
| restaurant | fine_dining | Slow forward dolly at seated eye level, moving between tables toward the back. Subtle depth-of-field shift. |
| salon | — | Slow forward dolly at standing eye level, moving through the salon space past styling stations. |

All camera prompts end with: "Movement is unhurried and continuous — no cuts, no pans, no tilts."

---

## 16. Data Contract — Database Schema

### `leads` Table

```sql
CREATE TABLE leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_name VARCHAR(255) NOT NULL,
  area VARCHAR(255) NOT NULL,
  business_type ENUM('restaurant', 'salon') NOT NULL,
  business_subtype VARCHAR(100),
  slug VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'NEW_LEAD',

  -- Contact info
  google_maps_url TEXT,
  current_website_url TEXT,
  instagram_url TEXT,
  email VARCHAR(320),
  whatsapp_number VARCHAR(50),
  phone_number VARCHAR(50),
  logo_url TEXT,
  photo_urls JSON,           -- string[]
  screenshot_urls JSON,      -- string[]
  source_photos JSON,        -- string[]
  notes TEXT,

  -- Template & ambiance
  template VARCHAR(100),
  ambiance_lighting VARCHAR(50),
  ambiance_surfaces VARCHAR(50),
  ambiance_color_palette VARCHAR(50),
  ambiance_mood VARCHAR(50),
  ambiance_time_of_day VARCHAR(50),
  palette_accent VARCHAR(20),
  ambiance_density VARCHAR(50),
  ambiance_texture_emphasis VARCHAR(50),
  ambiance_accent_color VARCHAR(20),

  -- Generated content
  hero_tagline VARCHAR(500),
  hero_subtitle TEXT,
  story_paragraphs JSON,     -- string[]
  menu_items JSON,           -- Array<{name, desc?, price?}>
  atmosphere_caption VARCHAR(500),
  gallery_images JSON,       -- string[]
  gallery_captions JSON,     -- string[]
  cta_title VARCHAR(500),
  cta_subtitle TEXT,
  info_address TEXT,
  info_hours TEXT,
  info_phone VARCHAR(50),
  info_reservation_url TEXT,

  -- Video pipeline results
  video_url TEXT,
  video_task_id VARCHAR(255),
  video_cost_usd VARCHAR(20),
  frames_path_landscape TEXT,
  frame_count_landscape INT,
  frame_urls_landscape JSON, -- string[]
  frames_path_portrait TEXT,
  frame_count_portrait INT,
  frame_urls_portrait JSON,  -- string[]

  -- Timestamps
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);
```

### Lead Creation API

```typescript
// tRPC mutation: leads.create
input: {
  store_name: string;           // Required
  area: string;                 // Required
  business_type: 'restaurant' | 'salon';  // Required
  business_subtype?: string;
  google_maps_url?: string;
  photo_urls?: string[];
  source_photos?: string[];
  notes?: string;
  template?: string;
  ambiance_lighting?: string;
  ambiance_surfaces?: string;
  ambiance_color_palette?: string;
  ambiance_mood?: string;
  ambiance_time_of_day?: string;
  hero_tagline?: string;
  hero_subtitle?: string;
  story_paragraphs?: string[];
  atmosphere_caption?: string;
  gallery_images?: string[];
  gallery_captions?: string[];
  cta_title?: string;
  cta_subtitle?: string;
  menu_items?: Array<{ name: string; desc?: string; price?: string }>;
  info_address?: string;
  info_hours?: string;
  info_phone?: string;
  info_reservation_url?: string;
  palette_accent?: string;
  // ... more optional fields
}

output: {
  id: number;
  slug: string;
  status: 'NEW_LEAD';
}
```

### Slug Generation

```typescript
function buildSlug(storeName: string, area?: string): string {
  // kebab(storeName) + kebab(area) + 6-char random suffix
  // e.g. "la-letizia-dubai-marina-x7k2m9"
}
```

---

## 17. Design Tokens

### CSS Custom Properties (`index.css`)

```css
:root {
  /* Page base */
  --bg: #FBFAF8;
  --ink: #1A1714;
  --accent: #B0552F;

  /* Overlay (on dark video frames) */
  --overlay-text: #F2EEE8;
  --overlay-gradient: linear-gradient(
    to bottom,
    rgba(26, 23, 20, 0.55) 0%,
    rgba(26, 23, 20, 0.15) 40%,
    rgba(26, 23, 20, 0.0) 60%,
    rgba(26, 23, 20, 0.25) 100%
  );
  --overlay-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);

  /* Typography scale (fluid) */
  --fs-hero: clamp(42px, 7.5vw, 96px);
  --fs-h2: clamp(28px, 4.2vw, 56px);
  --fs-h3: clamp(20px, 2.4vw, 32px);
  --fs-body: clamp(15px, 1.1vw, 18px);
  --fs-eyebrow: clamp(10px, 0.85vw, 13px);

  /* Spacing */
  --space-section: clamp(80px, 12svh, 160px);
  --space-block: clamp(32px, 5svh, 64px);
  --gutter: clamp(20px, 4vw, 64px);
  --maxw: 1200px;

  /* Fonts */
  --font-heading: 'Cormorant Garamond', serif;
  --font-body: 'Inter', sans-serif;
}
```

### Typography Hierarchy

| Role | Font | Weight | Style | Size | Letter-spacing |
|------|------|--------|-------|------|----------------|
| Hero title | Cormorant Garamond | 300 | italic | `--fs-hero` | -0.015em |
| Section heading | Cormorant Garamond | 300 | italic | `--fs-h2` | -0.015em |
| Eyebrow | Inter | 400 | normal | `--fs-eyebrow` | 0.32em |
| Body | Inter | 400 | normal | `--fs-body` | normal |
| Nav numbers | Inter | 400 | normal | 11px | 0.18em |

### Color Usage

| Context | Color | Usage |
|---------|-------|-------|
| Dark sections | `#0E0D0C` | Background for hero, atmosphere, gallery, info, CTA, footer |
| Light sections | `#FBFAF8` (`--bg`) | Menu section background |
| Text on dark | `rgba(242, 238, 232, 0.85)` | Primary text on dark backgrounds |
| Text on dark (muted) | `rgba(242, 238, 232, 0.4–0.6)` | Secondary text, links |
| Text on light | `#1A1714` (`--ink`) | Primary text on light backgrounds |
| Accent | `#B0552F` | Eyebrow text, hover states on light bg |

---

## 18. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| < 768px | Frame stride=2 (load half frames), portrait video variant, single-column layouts |
| ≥ 768px | Full frame loading, landscape video, multi-column grids, parallax effects |
| Custom cursor | Only on `(hover: hover) and (pointer: fine)` — hidden on touch |
| Reduced motion | Static frame display, no scroll animations |

---

## 19. Performance Budget

| Metric | Target |
|--------|--------|
| Frame count | 241 (landscape), variable (portrait) |
| Frame size | ~15–30KB each (WebP quality 90, 1280×720) |
| Total frame payload | ~5–7MB (landscape, all frames) |
| Mobile payload | ~2.5–3.5MB (stride=2, half frames) |
| Video generation | ~$0.386/video |
| Total cost per LP | ~$0.386 (1 landscape video) or ~$0.772 (+ portrait) |
| Pipeline time | ~2–5 minutes (video gen + frame extraction + upload) |

---

## 20. File Structure

```
client/src/
├── pages/
│   └── DemoPage.tsx              # Restaurant template orchestrator
├── components/
│   ├── PageScrollScrub.tsx       # Core video scrub engine
│   ├── RestaurantMenuFadeIn.tsx  # Dark bridge transition
│   ├── CinematicLoader.tsx       # Loading screen
│   ├── SmoothScroll.tsx          # Lenis integration
│   ├── PageTransitions.tsx       # Global GSAP choreography
│   ├── CustomCursor.tsx          # Context-aware cursor
│   ├── MagneticButton.tsx        # Magnetic hover wrapper
│   ├── MdsBadge.tsx              # Fixed badge
│   ├── overlays/
│   │   ├── ScrubOverlay.tsx      # Base overlay wrapper
│   │   ├── HeroOverlay.tsx       # Hero text (frames 0–75)
│   │   ├── StoryOverlay.tsx      # Story text (frames 75–150)
│   │   ├── SiteMenuOverlay.tsx   # Nav links (frames 135–210)
│   │   └── FreezeOverlay.tsx     # Final freeze (frames 195–241)
│   └── sections/
│       ├── AtmosphereSection.tsx  # Pin + clip-path reveal
│       ├── MenuSection.tsx       # Editorial menu list
│       ├── GallerySection.tsx    # Horizontal scroll gallery
│       ├── InfoSection.tsx       # Contact/hours info
│       ├── CtaSection.tsx        # Call to action
│       └── FooterSection.tsx     # Minimal footer
├── hooks/
│   └── useFrameLoader.ts        # Frame preloading hook
└── index.css                     # Design tokens

server/
├── routers/
│   └── leads.ts                  # tRPC leads CRUD + pipeline trigger
├── pipeline/
│   ├── index.ts                  # Pipeline orchestrator
│   ├── video.ts                  # Seedance API integration
│   ├── frames.ts                 # ffmpeg frame extraction + S3 upload
│   └── prompts/
│       ├── ambiance.ts           # Ambiance phrase builder
│       ├── cameraWork.ts         # Camera movement prompts
│       └── defaultAmbiance.ts    # Ambiance resolution (3-tier)
└── storage.ts                    # S3 helpers (storagePut, storageGet)

drizzle/
└── schema.ts                     # leads + users tables
```

---

## 21. Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `gsap` | ^3.12 | Animation engine (ScrollTrigger, ticker) |
| `lenis` | ^1.1 | Smooth scroll |
| `react` | ^19.0 | UI framework |
| `drizzle-orm` | ^0.38 | Database ORM |
| `@trpc/server` | ^11.0 | Type-safe API |
| `zod` | ^3.23 | Input validation |
| `express` | ^4.21 | HTTP server |

---

## 22. LP Factory Integration

The restaurant template is one of two templates in the LP Factory mass-production system (the other being `webgl_liquid` for salons). The LP Factory hearing form (`sales-kpi-app/LpFactoryInput.tsx`) collects store data and triggers lead creation via the `leads.create` tRPC mutation, which automatically fires the video generation pipeline.

### Production Flow

```
Hearing Form → leads.create API → Pipeline (video → frames → S3) → LP viewable at /r/:slug
```

### Cost Model

- 1 video per LP (landscape): ~$0.386
- Optional portrait video: +$0.386
- Total per LP: $0.386–$0.772

---

*End of specification.*
