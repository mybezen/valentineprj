'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import IntroPhase from '../components/phases/IntroPhase';
import TrollGame from '../components/phases/TrollGame';
import ColorTransition from '../components/ui/ColorTransition';
import GalleryPhase from '../components/phases/GalleryPhase';
import GiftPhase from '../components/phases/GiftPhase';
import type { Phase, PhotoItem } from '../types';
import MusicPlayer from '../components/ui/MusicPlayer';

// Dummy photos - Replace with your actual photos
const DUMMY_PHOTOS: PhotoItem[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=400&h=711&fit=crop',
    alt: 'Momen pertama kita'
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=711&fit=crop',
    alt: 'Senyummu yang indah'
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1522673607186-0458ffe86ffa?w=400&h=711&fit=crop',
    alt: 'Petualangan bersama'
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1502209877429-d7c6df9eb3f9?w=400&h=711&fit=crop',
    alt: 'Kenangan manis'
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=711&fit=crop',
    alt: 'Waktu bersama yang berharga'
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=711&fit=crop',
    alt: 'Tawa dan kebahagiaan'
  },
];

// Replace with your commissioned artwork or special image
const GIFT_IMAGE = 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=400&h=711&fit=crop';

// Debug mode - set to true to enable phase navigation buttons
const DEBUG_MODE = false;

export default function HomePage() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');

  const handlePhaseChange = (newPhase: Phase) => {
    console.log(`🔄 Phase transition: ${currentPhase} → ${newPhase}`);
    setCurrentPhase(newPhase);
  };

  useEffect(() => {
    console.log(`✅ Current phase: ${currentPhase}`);
  }, [currentPhase]);

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      {/* Debug navigation - only in dev mode */}
      {DEBUG_MODE && (
        <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-white/20">
          <p className="text-white text-xs mb-2 font-mono">Debug: {currentPhase}</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handlePhaseChange('intro')}
              className="px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-white rounded"
            >
              Intro
            </button>
            <button
              onClick={() => handlePhaseChange('game')}
              className="px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-white rounded"
            >
              Game
            </button>
            <button
              onClick={() => handlePhaseChange('transition')}
              className="px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-white rounded"
            >
              Transition
            </button>
            <button
              onClick={() => handlePhaseChange('gallery')}
              className="px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-white rounded"
            >
              Gallery
            </button>
            <button
              onClick={() => handlePhaseChange('gift')}
              className="px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-white rounded"
            >
              Gift
            </button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {currentPhase === 'intro' && (
          <IntroPhase 
            key="intro"
            onStart={() => {
              console.log('🎬 Intro: Starting game...');
              handlePhaseChange('game');
            }} 
          />
        )}

        {currentPhase === 'game' && (
          <TrollGame 
            key="game"
            onComplete={() => {
              console.log('🎮 Game: Completed! Moving to transition...');
              handlePhaseChange('transition');
            }} 
          />
        )}

        {currentPhase === 'transition' && (
          <ColorTransition 
            key="transition"
            onComplete={() => {
              console.log('🌈 Transition: Complete! Moving to gallery...');
              handlePhaseChange('gallery');
            }} 
          />
        )}

        {currentPhase === 'gallery' && (
          <GalleryPhase
            key="gallery"
            photos={DUMMY_PHOTOS}
            onContinue={() => {
              console.log('🖼️ Gallery: Continuing to gift...');
              handlePhaseChange('gift');
            }}
          />
        )}

        {currentPhase === 'gift' && (
          <GiftPhase 
            key="gift"
            giftImageSrc={GIFT_IMAGE}
          />
        )}
      </AnimatePresence>
    </main>
  );
}