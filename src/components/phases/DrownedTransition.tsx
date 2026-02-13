// components/phases/DrownedTransition.tsx
'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useSpring, animated } from '@react-spring/web';

interface DrownedTransitionProps {
  onComplete: () => void;
}

export default function DrownedTransition({ onComplete }: DrownedTransitionProps) {
  const bubblesRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);

  const [springs] = useSpring(() => ({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    config: { tension: 200, friction: 20 },
    delay: 500,
  }));

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: onComplete,
      delay: 4, // Extended duration for more wow
    });

    // Create more bubbles for wow effect
    const bubbles = Array.from({ length: 50 }).map(() => {
      const bubble = document.createElement('div');
      bubble.className = 'absolute rounded-full bg-blue-300/20 blur-md shadow-lg';
      bubblesRef.current?.appendChild(bubble);
      return bubble;
    });

    // Animate bubbles with varied paths
    bubbles.forEach((bubble, i) => {
      const size = Math.random() * 60 + 20;
      gsap.set(bubble, {
        width: size,
        height: size,
        left: `${Math.random() * 100}%`,
        bottom: '-100%',
        scale: 0.3,
        opacity: 0.9,
      });

      tl.to(
        bubble,
        {
          y: '-200vh',
          x: Math.sin(i) * 300,
          scale: 1.5,
          opacity: 0,
          duration: Math.random() * 2 + 2,
          ease: 'power1.out',
        },
        i * 0.05
      );
    });

    // Wave effect
    gsap.to(waveRef.current, {
      backgroundPositionY: '100%',
      duration: 4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    // Background drown with gradient animation
    tl.to(bubblesRef.current, {
      backgroundColor: 'rgba(0, 20, 80, 0.9)',
      duration: 2,
      ease: 'power3.inOut',
    }, 0);

    tl.to(bubblesRef.current, {
      filter: 'blur(5px)',
      duration: 1.5,
      ease: 'power2.in',
    }, 2);

    // Cleanup
    return () => {
      bubbles.forEach(bubble => bubble.remove());
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden"
      ref={bubblesRef}
    >
      <div 
        ref={waveRef}
        className="absolute inset-0 bg-gradient-to-b from-blue-700/50 to-blue-300/30"
        style={{ backgroundSize: '100% 200%' }}
      />
      <animated.h2
        style={springs}
        className="text-white text-3xl font-light z-10 drop-shadow-lg"
      >
        nyelem dulu yukz
      </animated.h2>
    </motion.div>
  );
}