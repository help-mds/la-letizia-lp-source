/**
 * Gradient bridge between the dark video scrub section and the white
 * content sections below. Creates a smooth visual transition.
 *
 * Faithfully translated from ZIP: components/templates/restaurant/RestaurantMenuFadeIn.tsx
 */
export default function RestaurantMenuFadeIn() {
  return (
    <div
      aria-hidden
      className="relative w-full"
      style={{
        height: 'clamp(120px, 20svh, 240px)',
        background: `linear-gradient(
          to bottom,
          var(--ink) 0%,
          var(--bg) 100%
        )`,
      }}
    />
  );
}
