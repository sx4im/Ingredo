import { useEffect, useRef, useState } from 'react';

export interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  distance?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'rotate';
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier';
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
    duration = 1000,
    distance = '30px',
    direction = 'up',
    easing = 'ease-out'
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (triggerOnce && hasTriggered) return;
          
          setTimeout(() => {
            setIsVisible(true);
            setHasTriggered(true);
          }, delay);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered]);

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return `translateY(${distance})`;
        case 'down':
          return `translateY(-${distance})`;
        case 'left':
          return `translateX(${distance})`;
        case 'right':
          return `translateX(-${distance})`;
        case 'scale':
          return 'scale(0.8)';
        case 'rotate':
          return 'rotate(-5deg)';
        default:
          return 'translateY(0px)';
      }
    }
    return 'translateY(0px) translateX(0px) scale(1) rotate(0deg)';
  };

  const getOpacity = () => {
    return isVisible ? 1 : 0;
  };

  const style = {
    opacity: getOpacity(),
    transform: getTransform(),
    transition: `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`,
  };

  return {
    ref: elementRef,
    isVisible,
    style
  };
}

// Predefined animation presets
export const scrollRevealPresets = {
  fadeUp: {
    direction: 'up' as const,
    distance: '30px',
    duration: 1000,
    easing: 'ease-out' as const,
    delay: 0
  },
  fadeDown: {
    direction: 'down' as const,
    distance: '30px',
    duration: 1000,
    easing: 'ease-out' as const,
    delay: 0
  },
  fadeLeft: {
    direction: 'left' as const,
    distance: '30px',
    duration: 1000,
    easing: 'ease-out' as const,
    delay: 0
  },
  fadeRight: {
    direction: 'right' as const,
    distance: '30px',
    duration: 1000,
    easing: 'ease-out' as const,
    delay: 0
  },
  scale: {
    direction: 'scale' as const,
    distance: '0px',
    duration: 1200,
    easing: 'ease-out' as const,
    delay: 0
  },
  rotate: {
    direction: 'rotate' as const,
    distance: '0px',
    duration: 1000,
    easing: 'ease-out' as const,
    delay: 0
  },
  slowFadeUp: {
    direction: 'up' as const,
    distance: '50px',
    duration: 1500,
    easing: 'ease-out' as const,
    delay: 200
  },
  slowFadeDown: {
    direction: 'down' as const,
    distance: '50px',
    duration: 1500,
    easing: 'ease-out' as const,
    delay: 200
  },
  staggered: {
    direction: 'up' as const,
    distance: '40px',
    duration: 1200,
    easing: 'ease-out' as const,
    delay: 100
  }
};
