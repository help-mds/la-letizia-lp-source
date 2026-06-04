# Glassmorphism Redesign Notes

## Reference Image 1 (IMG_8650 - Current state on mobile)
- Shows current LP on mobile with tooltip cutting off text
- Dot nav at top center (small white dots)
- DESIGNED BY MDS top-left, RESERVE top-right
- Up/down arrows right side (small, dark)
- Tooltip is narrow and text gets cut off — needs full-screen treatment

## Reference Image 2 (IMG_8651 - Marina Bay Sands popup)
- Full-screen dark modal with rounded corners
- Large title text (serif), body text, CTA button
- Close X button top-left
- Beige/gold CTA button ("FOLLOW THE JOURNEY")
- Dark background (rgba black with blur)
- Icon at top of modal
- This is the target for mobile tooltip/popup

## Reference Image 3 (IMG_8652 - Marina Bay Sands scene nav)
- Glassmorphism pill nav at top (metallic/glass look with beveled edges)
- Active dot = gold/yellow, inactive = silver/grey metallic
- Up/down arrows: RIGHT BOTTOM corner, large circular glass buttons (~60px)
- Arrows have metallic/glass 3D look with chevron icons
- Hotspot buttons: grey glass circles with + icon
- Overall: premium glass/metal aesthetic

## Design Tokens to Implement
- Beige/gold active: #C9A96E or similar warm gold
- Glass background: rgba(255, 255, 255, 0.12) + backdrop-blur(20px)
- Glass border: rgba(255, 255, 255, 0.25) with subtle gradient
- Inactive dots: rgba(255, 255, 255, 0.15) with metallic border
- Arrow buttons: larger (~56px), glass effect, right-bottom on mobile
- Mobile tooltip: full-screen dark modal (like MBS image 2)
- Beige CTA button background: #C9A96E or lighter beige like #D4B896
