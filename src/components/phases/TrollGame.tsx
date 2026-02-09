'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';

interface TrollGameProps {
    onComplete: () => void;
}

const REQUIRED_CLICKS = 5;
const HEART_SIZE = 80;
const PADDING = 32;

const MESSAGES = [
    "Almost there...",
    "You're getting closer ♥",
    "Keep going, love",
    "Just a little more...",
    "I knew you could do it",
];

export default function TrollGame({ onComplete }: TrollGameProps) {
    const [clicks, setClicks] = useState(0);
    const [currentMessage, setCurrentMessage] = useState(MESSAGES[0]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showInstruction, setShowInstruction] = useState(true); // kontrol instruksi awal
    const containerRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();

    const getRandomPosition = () => {
        if (!containerRef.current) return { x: 0, y: 0 };
        const rect = containerRef.current.getBoundingClientRect();
        const maxX = rect.width - HEART_SIZE - PADDING * 2;
        const maxY = rect.height - HEART_SIZE - PADDING * 2;
        return {
            x: Math.random() * maxX + PADDING,
            y: Math.random() * maxY + PADDING,
        };
    };

    const handleStart = () => {
        setShowInstruction(false);
        // Inisialisasi posisi heart pertama kali setelah instruksi hilang
        const initial = getRandomPosition();
        controls.start({ x: initial.x, y: initial.y, scale: 1, opacity: 1 });
    };

    const handleClick = async () => {
        const newClicks = clicks + 1;
        setClicks(newClicks);

        const msgIndex = Math.min(newClicks - 1, MESSAGES.length - 1);
        setCurrentMessage(MESSAGES[msgIndex]);

        if (newClicks < REQUIRED_CLICKS) {
            const pos = getRandomPosition();
            await controls.start({
                x: pos.x,
                y: pos.y,
                scale: 1.25,
                transition: {
                    type: 'spring',
                    stiffness: 400,
                    damping: 12,
                    mass: 0.8,
                },
            });
            controls.start({ scale: 1, transition: { duration: 0.3 } });
        } else {
            setShowSuccess(true);
            await controls.start({
                scale: 1.8,
                opacity: 0,
                rotate: 360,
                transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
            });
            setTimeout(() => {
                onComplete();
            }, 1300);
        }
    };

    useEffect(() => {
        // Jangan inisialisasi posisi heart kalau masih di instruksi
        if (!showInstruction) {
            const initial = getRandomPosition();
            controls.start({ x: initial.x, y: initial.y, scale: 1, opacity: 1 });
        }
    }, [controls, showInstruction]);

    return (
        <div className="relative min-h-screen w-full bg-gradient-to-b from-black to-zinc-950 flex flex-col items-center justify-center px-6 overflow-hidden">
            {/* Instruksi awal (overlay) */}
            <AnimatePresence>
                {showInstruction && (
                    <motion.div
                        key="instruction"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
                    >
                        <div className="max-w-md text-center">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="text-3xl md:text-4xl font-light text-white mb-6 tracking-wide"
                            >
                                Catch My Heart
                            </motion.h2>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="text-zinc-300 text-base md:text-lg mb-10 leading-relaxed"
                            >
                                Tap the heart as many times as you can.
                                It might try to escape... but don't give up.
                            </motion.p>

                            <motion.button
                                onClick={handleStart}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-light text-lg tracking-wide hover:bg-white/15 transition-all duration-300"
                            >
                                I'm Ready
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pesan motivasi selama game */}
            <AnimatePresence>
                {!showInstruction && !showSuccess && (
                    <motion.div
                        key={clicks}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-28 sm:top-32 left-0 right-0 text-center z-20 pointer-events-none"
                    >
                        <p className="text-zinc-300 text-lg sm:text-xl font-light tracking-wide drop-shadow-md">
                            {currentMessage}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Area game */}
            <div ref={containerRef} className="relative w-full max-w-md aspect-[4/5] sm:aspect-square mx-auto z-10">
                <motion.button
                    animate={controls}
                    className="absolute cursor-pointer touch-none select-none focus:outline-none"
                    style={{
                        width: HEART_SIZE,
                        height: HEART_SIZE,
                        opacity: showInstruction ? 0 : 1,               // ← move opacity here
                    }}
                    whileTap={{ scale: 0.92 }}
                    initial={{ opacity: 0 }}
                    onClick={handleClick}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-full h-full text-rose-500 drop-shadow-[0_0_24px_rgba(244,63,94,0.6)]"
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </motion.button>
            </div>

            {/* Success screen */}
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-30"
                >
                    <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.2 }}
                        className="text-center px-8"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="text-7xl sm:text-8xl mb-6"
                        >
                            ❤️
                        </motion.div>
                        <p className="text-white text-2xl sm:text-3xl font-light tracking-wide">
                            You caught my heart
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}