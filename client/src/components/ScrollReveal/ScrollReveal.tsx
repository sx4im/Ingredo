import React from 'react';
import { useScrollReveal, scrollRevealPresets, type UseScrollRevealOptions } from '@/hooks/use-scroll-reveal';

interface ScrollRevealProps extends UseScrollRevealOptions {
  children: React.ReactNode;
  className?: string;
  preset?: keyof typeof scrollRevealPresets;
  as?: React.ElementType;
}

export function ScrollReveal({ 
  children, 
  className = '', 
  preset,
  as: Component = 'div',
  ...options 
}: ScrollRevealProps) {
  const scrollOptions = preset ? { ...scrollRevealPresets[preset], ...options } : options;
  const { ref, style } = useScrollReveal(scrollOptions);

  return (
    <Component 
      ref={ref} 
      style={style} 
      className={className}
    >
      {children}
    </Component>
  );
}

// Convenience components for common animations
export const FadeUp = ({ children, className, ...props }: ScrollRevealProps) => (
  <ScrollReveal preset="fadeUp" className={className} {...props}>
    {children}
  </ScrollReveal>
);

export const FadeDown = ({ children, className, ...props }: ScrollRevealProps) => (
  <ScrollReveal preset="fadeDown" className={className} {...props}>
    {children}
  </ScrollReveal>
);

export const FadeLeft = ({ children, className, ...props }: ScrollRevealProps) => (
  <ScrollReveal preset="fadeLeft" className={className} {...props}>
    {children}
  </ScrollReveal>
);

export const FadeRight = ({ children, className, ...props }: ScrollRevealProps) => (
  <ScrollReveal preset="fadeRight" className={className} {...props}>
    {children}
  </ScrollReveal>
);

export const Scale = ({ children, className, ...props }: ScrollRevealProps) => (
  <ScrollReveal preset="scale" className={className} {...props}>
    {children}
  </ScrollReveal>
);

export const Rotate = ({ children, className, ...props }: ScrollRevealProps) => (
  <ScrollReveal preset="rotate" className={className} {...props}>
    {children}
  </ScrollReveal>
);

export const SlowFadeUp = ({ children, className, ...props }: ScrollRevealProps) => (
  <ScrollReveal preset="slowFadeUp" className={className} {...props}>
    {children}
  </ScrollReveal>
);

export const SlowFadeDown = ({ children, className, ...props }: ScrollRevealProps) => (
  <ScrollReveal preset="slowFadeDown" className={className} {...props}>
    {children}
  </ScrollReveal>
);

export const Staggered = ({ children, className, ...props }: ScrollRevealProps) => (
  <ScrollReveal preset="staggered" className={className} {...props}>
    {children}
  </ScrollReveal>
);
