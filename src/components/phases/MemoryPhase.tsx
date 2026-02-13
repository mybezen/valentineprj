// components/phases/MemoryPhase.tsx
'use client';

import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

gsap.registerPlugin(TextPlugin);

interface MemoryPhaseProps {
  text: string;
  onContinue: () => void;
}

export default function MemoryPhase({ text, onContinue }: MemoryPhaseProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [buttonSpring, api] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 10 },
  }));

  useEffect(() => {
    if (textRef.current) {
      // Clear existing content
      textRef.current.innerHTML = '';

      // Split text into lines for typing animation
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      lines.forEach((line, i) => {
        const p = document.createElement('p');
        p.className = 'mb-4 last:mb-0';
        textRef.current?.appendChild(p);

        gsap.to(p, {
          duration: line.length * 0.05,
          text: { value: line, delimiter: '' },
          ease: 'none',
          delay: i * 2, // Stagger lines
          onComplete: () => {
            if (i === lines.length - 1) {
              gsap.to(textRef.current, {
                textShadow: '0 0 8px rgba(255,255,255,0.3)',
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
              });
            }
          }
        });
      });
    }
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      className="min-h-screen bg-gradient-to-b from-black to-gray-800 flex flex-col items-center justify-center p-4 sm:p-8 text-white"
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1, type: 'spring', stiffness: 100 }}
        className="text-3xl sm:text-5xl font-light mb-6 sm:mb-12 tracking-wide text-center"
      >
        our memories
      </motion.h1>

      <div 
        ref={textRef}
        className="w-full max-w-md sm:max-w-3xl p-6 sm:p-8 bg-white/5 rounded-2xl backdrop-blur-md text-white text-base sm:text-lg leading-relaxed border border-white/20 shadow-md overflow-y-auto max-h-[50vh] sm:max-h-[60vh]"
      />

      <animated.button
        style={buttonSpring}
        onMouseEnter={() => api.start({ scale: 1.1 })}
        onMouseLeave={() => api.start({ scale: 1 })}
        onClick={onContinue}
        className="mt-6 sm:mt-16 px-8 sm:px-10 py-3 sm:py-4 bg-white/5 rounded-full text-white font-light text-base sm:text-lg tracking-wide hover:bg-white/10 transition-all duration-300 shadow-md border border-white/20 backdrop-blur-md"
      >
        go to ending
      </animated.button>
    </motion.div>
  );
}