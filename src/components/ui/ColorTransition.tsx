'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface ColorTransitionProps {
  onComplete: () => void;
}

export default function ColorTransition({ onComplete }: ColorTransitionProps) {
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    setShowEmoji(true);
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Subtle gradient accents - stays subtle on black */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 30%, rgba(249, 168, 212, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(232, 121, 249, 0.1) 0%, transparent 50%)
          `
        }}
      />

      {/* Celebration emojis */}
      {showEmoji && (
        <div className="relative z-10">
          {['❤️', '💕', '✨', '💖', '🌸', '💝'].map((emoji, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0, 
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0, 1.5, 1.5, 0],
                x: [0, (Math.random() - 0.5) * 300],
                y: [0, (Math.random() - 0.5) * 300],
                rotate: [0, (Math.random() - 0.5) * 360],
              }}
              transition={{
                duration: 2,
                delay: i * 0.15,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="absolute top-1/2 left-1/2 text-6xl"
              style={{
                transform: 'translate(-50%, -50%)'
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      )}

      {/* Center message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <div className="text-center">
          <motion.h2 
            className="text-5xl md:text-6xl font-light text-white tracking-tight mb-4"
            animate={{ 
              textShadow: [
                '0 0 20px rgba(236,72,153,0.4)',
                '0 0 40px rgba(236,72,153,0.6)',
                '0 0 20px rgba(236,72,153,0.4)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Perfect!
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: 0.8 }}
            className="h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"
          />
        </div>
      </motion.div>
    </div>
  );
}