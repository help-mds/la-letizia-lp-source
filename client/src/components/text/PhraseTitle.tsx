interface Props {
  /** The heading text to display. */
  children: string;
  /** HTML tag to render. */
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  /** Additional className. */
  className?: string;
}

/**
 * Heading component using the heading font with restaurant-luxury styling.
 *
 * Faithfully translated from ZIP: components/text/PhraseTitle.tsx
 */
export default function PhraseTitle({
  children,
  as: Tag = 'h2',
  className = '',
}: Props) {
  return (
    <Tag
      className={className}
      style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--fs-h2)',
        lineHeight: 1.05,
        fontWeight: 300,
        fontStyle: 'italic',
        letterSpacing: '-0.02em',
        color: 'var(--ink)',
      }}
    >
      {children}
    </Tag>
  );
}
