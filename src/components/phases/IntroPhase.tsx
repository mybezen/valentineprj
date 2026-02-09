'use client';

import { motion } from 'motion/react';

interface IntroPhaseProps {
    onStart: () => void;
}

export default function IntroPhase({ onStart }: IntroPhaseProps) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center px-6">
            {/* Very subtle ambient glow */}
            <motion.div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            <div className="relative z-10 flex flex-col items-center max-w-md w-full">
                {/* Main heading - more intimate */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-12 leading-tight">
                        Happy Valentine Day
                    </h1>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '80%' }}
                        transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="h-px mx-auto bg-gradient-to-r from-transparent via-rose-300/30 to-transparent"
                    />
                </motion.div>

                {/* Subtitle - soft and personal */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="text-zinc-300 text-center mb-16 text-base md:text-lg tracking-wide leading-relaxed font-light"
                >
                    JAJAJAJA apani?!
                </motion.p>

                {/* CTA Button - clean, elegant, subtle shimmer */}
                <motion.button
                    onClick={onStart}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative mt-8 px-10 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-light text-base tracking-wide overflow-hidden transition-all duration-500 hover:bg-white/15 hover:border-rose-300/40"
                >
                    {/* Gentle shimmer on hover */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                    />
                    <span className="relative z-10 flex items-center gap-3">
                        Begin
                        <svg
                            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </span>
                </motion.button>

                {/* Minimal scroll hint - very subtle */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 1.5, delay: 1.5 }}
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-6 h-10 border border-white/30 rounded-full flex items-start justify-center pt-2"
                    >
                        <motion.div
                            className="w-1 h-2 bg-white/40 rounded-full"
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}