// components/phases/FlashbackPhase.tsx
'use client';

import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';

interface FlashbackPhaseProps {
  onContinue: () => void;
}

export default function FlashbackPhase({ onContinue }: FlashbackPhaseProps) {
  const dateRefs = useRef<(HTMLDivElement | null)[]>([]);
  const parallaxRef = useRef<any>(null);

  const [buttonSpring, api] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 10 },
  }));

  useEffect(() => {
    const tl = gsap.timeline();

    dateRefs.current.forEach((date, i) => {
      if (date) {
        tl.from(date, {
          opacity: 0,
          x: -50,
          scale: 0.8,
          duration: 0.8,
          ease: 'back.out(1.7)',
        }, i * 0.8);
      }
    });

    tl.to(dateRefs.current.filter(Boolean), {
      boxShadow: '0 0 15px rgba(255,255,255,0.2)',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      stagger: 0.5,
      ease: 'sine.inOut',
    });

    // Subtle parallax effect on mobile - using scroll
    const handleScroll = () => {
      if (parallaxRef.current) {
        parallaxRef.current.scrollTo(window.scrollY / 1000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
      className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center p-4 sm:p-8 text-white overflow-hidden"
    >
      <Parallax ref={parallaxRef} pages={1.5} className="w-full">
        <ParallaxLayer offset={0} speed={0.1} className="flex justify-center items-center">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1, type: 'spring', stiffness: 120 }}
            className="text-3xl sm:text-5xl font-light mb-8 sm:mb-16 tracking-wide text-center"
          >
            Flashback Tanggal Spesial
          </motion.h1>
        </ParallaxLayer>

        <ParallaxLayer offset={0.2} speed={0.3}>
          <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8 sm:gap-12 relative">
            {/* Enhanced glassmorphism stepper line */}
            <div className="absolute w-1 h-full left-1/2 transform -translate-x-1/2 bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]" />

            <div 
              ref={el => { dateRefs.current[0] = el; }}
              className="relative w-full p-4 sm:p-6 bg-white/5 rounded-xl backdrop-blur-lg border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] text-center z-10 saturate-150"
            >
              <div className="absolute -left-2 sm:-left-3 top-1/2 w-4 sm:w-6 h-4 sm:h-6 bg-gradient-to-r from-black to-gray-900 rounded-full border border-white/20 shadow-md transform -translate-y-1/2" />
              <p className="text-2xl sm:text-3xl font-bold text-white">20 Oct</p>
              <p className="text-base sm:text-lg text-gray-200 mt-1">our first chat</p>
            </div>

            <div 
              ref={el => { dateRefs.current[1] = el; }}
              className="relative w-full p-4 sm:p-6 bg-white/5 rounded-xl backdrop-blur-lg border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] text-center z-10 saturate-150"
            >
              <div className="absolute -left-2 sm:-left-3 top-1/2 w-4 sm:w-6 h-4 sm:h-6 bg-gradient-to-r from-black to-gray-900 rounded-full border border-white/20 shadow-md transform -translate-y-1/2" />
              <p className="text-2xl sm:text-3xl font-bold text-white">26 Nov</p>
              <p className="text-base sm:text-lg text-gray-200 mt-1">our official dating date</p>
            </div>
          </div>
        </ParallaxLayer>
      </Parallax>

      <animated.button
        style={buttonSpring}
        onMouseEnter={() => api.start({ scale: 1.1 })}
        onMouseLeave={() => api.start({ scale: 1 })}
        onClick={onContinue}
        className="mt-8 sm:mt-16 px-8 sm:px-10 py-3 sm:py-4 bg-white/5 rounded-full backdrop-blur-md text-white font-light text-base sm:text-lg tracking-wide hover:bg-white/10 transition-all duration-300 shadow-md border border-white/20"
      >
        nextt
      </animated.button>
    </motion.div>
  );
}