// components/phases/EndingPhase.tsx
'use client';

import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

export default function EndingPhase() {
  const endingRef = useRef<HTMLDivElement>(null);
  const [springs] = useSpring(() => ({
    from: { opacity: 0, y: -50 },
    to: { opacity: 1, y: 0 },
    config: { duration: 2000, easing: t => t * t * (3 - 2 * t) },
    delay: 1000,
  }));

  useEffect(() => {
    if (endingRef.current) {
      const tl = gsap.timeline({ repeat: -1, yoyo: true });

      tl.to(endingRef.current, {
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,1) 100%)',
        duration: 3,
        ease: 'sine.inOut',
      });

      gsap.to('.ending-text', {
        opacity: 1,
        y: 0,
        stagger: 0.4,
        duration: 1.8,
        ease: 'elastic.out(1, 0.3)',
      });

      gsap.to('.ending-text', {
        textShadow: '0 0 15px white',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1,
      });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2, ease: 'easeInOut' }}
      ref={endingRef}
      className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-white overflow-hidden"
    >
      <animated.h1
        style={springs}
        className="ending-text text-6xl font-light mb-12 opacity-0 translate-y-40"
      >
        ENDINGGGG
      </animated.h1>
      <p className="ending-text text-2xl text-gray-300 max-w-lg text-center opacity-0 translate-y-40 leading-relaxed">
        thanks untuk segalanya sayangku, hope we'll grow together in a good way ofc
      </p>
    </motion.div>
  );
}