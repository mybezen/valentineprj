import { Variants } from 'motion/react';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

export const breathe: Variants = {
  animate: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const floatVariants = (delay: number): Variants => ({
  animate: {
    y: [0, -15, 0],
    rotate: [-2, 2, -2],
    transition: {
      duration: 4 + delay,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }
  }
});

export const colorReveal: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 2, ease: "easeInOut" }
  }
};