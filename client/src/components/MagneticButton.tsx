import { useRef, useCallback, type ReactNode } from 'react';
import { gsap } from 'gsap';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: 'a' | 'button' | 'div';
  [key: string]: any;
}

/**
 * Magnetic hover effect wrapper. Elements subtly follow the cursor
 * when hovered, creating a premium interactive feel.
 */
export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  as: Tag = 'div',
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: 'power3.out',
      });
    },
    [strength],
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    });
  }, []);

  return (
    <Tag
      ref={ref as any}
      className={`inline-block ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      data-cursor-hover
      {...props}
    >
      {children}
    </Tag>
  );
}

export default MagneticButton;
