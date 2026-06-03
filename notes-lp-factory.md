# LP Factory Verification Notes

## /lp-input Form
- Form renders correctly with all sections:
  - Basic Information (store name, area, business type, subtype, notes)
  - Contact Information (Google Maps, Instagram, phone, email, WhatsApp)
  - Ambiance & Style (template, lighting, surfaces, color palette, mood, time of day, accent color)
  - Content & Copy (hero tagline, hero subtitle, story paragraphs, atmosphere caption, CTA title, CTA subtitle)
  - Menu Items (dynamic add/remove)
  - Gallery & Media (gallery images, captions, source photos)
  - Store Information (address, hours, phone, reservation URL)
  - Generate LP button

## DemoPage Template
- Now fully data-driven:
  - atmosphereCaption from DB (fallback: "Where mornings stretch longer.")
  - galleryCaptions from DB (fallback: default captions)
  - ctaTitle from DB (fallback: "Your table is waiting")
  - ctaSubtitle from DB (fallback: "Experience [Store] in person.")
  - paletteAccent from DB (fallback: #B0552F) → injected as --accent-dynamic CSS var
  - All existing fields (heroTagline, heroSubtitle, storyParagraphs, menuItems, galleryImages, etc.)

## Status
- TypeScript: No errors
- Form renders correctly
- Ready for end-to-end test
