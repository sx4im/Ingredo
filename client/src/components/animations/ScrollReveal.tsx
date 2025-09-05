import React from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

const directionVariants = {
  up: { y: 100, opacity: 0 },
  down: { y: -100, opacity: 0 },
  left: { x: 100, opacity: 0 },
  right: { x: -100, opacity: 0 },
  fade: { opacity: 0 }
};

const directionVariantsVisible = {
  up: { y: 0, opacity: 1 },
  down: { y: 0, opacity: 1 },
  left: { x: 0, opacity: 1 },
  right: { x: 0, opacity: 1 },
  fade: { opacity: 1 }
};

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  distance = 100,
  className = '',
  once = true,
  threshold = 0.1
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    threshold,
    margin: "0px 0px -100px 0px"
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  const customVariants = {
    hidden: {
      ...directionVariants[direction],
      y: direction === 'up' ? distance : direction === 'down' ? -distance : directionVariants[direction].y,
      x: direction === 'left' ? distance : direction === 'right' ? -distance : directionVariants[direction].x,
    },
    visible: {
      ...directionVariantsVisible[direction],
      y: 0,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smoothness
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={customVariants}
      initial="hidden"
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered animation for lists
interface StaggeredRevealProps {
  children: React.ReactNode[];
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  staggerDelay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

export function StaggeredReveal({
  children,
  direction = 'up',
  delay = 0,
  staggerDelay = 0.1,
  duration = 0.6,
  className = '',
  once = true,
  threshold = 0.1
}: StaggeredRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    threshold,
    margin: "0px 0px -50px 0px"
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const itemVariants = {
    hidden: {
      ...directionVariants[direction],
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : directionVariants[direction].y,
      x: direction === 'left' ? 50 : direction === 'right' ? -50 : directionVariants[direction].x,
    },
    visible: {
      ...directionVariantsVisible[direction],
      y: 0,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 25,
        duration,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className={className}
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Fade in animation
export function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  once = true,
  threshold = 0.1
}: Omit<ScrollRevealProps, 'direction' | 'distance'>) {
  return (
    <ScrollReveal
      direction="fade"
      delay={delay}
      duration={duration}
      className={className}
      once={once}
      threshold={threshold}
    >
      {children}
    </ScrollReveal>
  );
}

// Scale animation
export function ScaleIn({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  once = true,
  threshold = 0.1
}: Omit<ScrollRevealProps, 'direction' | 'distance'>) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    threshold,
    margin: "0px 0px -100px 0px"
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={controls}
      variants={{
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
          scale: 1,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 20,
            duration,
            delay,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
