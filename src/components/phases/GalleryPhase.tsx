'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

interface GalleryPhaseProps {
    onContinue: () => void;
    photos: Array<{ id: string; src: string; alt: string }>;
}

export default function GalleryPhase({ onContinue, photos }: GalleryPhaseProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    return (
        <div ref={containerRef} className="relative min-h-[300vh] w-full bg-black overflow-hidden">
            {/* Subtle fixed gradient overlay */}
            <div className="fixed inset-0 bg-gradient-to-b from-black via-zinc-950/40 to-black pointer-events-none z-0" />

            {/* Soft ambient glows */}
            <motion.div
                className="fixed top-1/4 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"
                style={{
                    opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.3]),
                }}
            />
            <motion.div
                className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"
                style={{
                    opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.3]),
                }}
            />

            {/* Sticky Header */}
            <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/70 border-b border-white/5">
                <div className="max-w-2xl mx-auto px-6 py-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight">
                            Our Memories
                        </h2>
                        <p className="text-zinc-400 text-sm mt-2">
                            Every moment with you feels timeless
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Floating Photos */}
            <div className="relative z-10">
                {photos.map((photo, index) => (
                    <FloatingPhoto
                        key={photo.id}
                        photo={photo}
                        index={index}
                        scrollProgress={scrollYProgress}
                        totalPhotos={photos.length}
                    />
                ))}
            </div>

            {/* Spacer + End message + CTA */}
            <div className="h-screen flex flex-col items-center justify-center py-24">
                {/* "You've reached the end" message */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center px-6 mb-12"
                >
                    <p className="text-zinc-400 text-xl md:text-2xl font-light tracking-wide">
                        You've reached the end...
                    </p>
                    <p className="text-zinc-500 text-base mt-3">
                        But this is just the beginning of something more special
                    </p>
                </motion.div>

                {/* Updated CTA Button - more minimal & elegant */}
                <motion.button
                    onClick={onContinue}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                    whileTap={{ scale: 0.97 }}
                    className="px-10 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/20 text-white font-light text-lg tracking-wide hover:bg-white/10 hover:border-rose-300/30 transition-all duration-400 shadow-sm hover:shadow-md"
                >
                    <span className="flex items-center justify-center gap-3">
                        Reveal Your Gift
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
            </div>
        </div>
    );
}

interface FloatingPhotoProps {
    photo: { id: string; src: string; alt: string };
    index: number;
    scrollProgress: any;
    totalPhotos: number;
}

function FloatingPhoto({ photo, index, scrollProgress, totalPhotos }: FloatingPhotoProps) {
    const photoRef = useRef<HTMLDivElement>(null);

    const isLeft = index % 2 === 0;
    const startPosition = (index / totalPhotos) * 100;
    const endPosition = ((index + 1) / totalPhotos) * 100;

    const y = useTransform(scrollProgress, [startPosition / 100, endPosition / 100], [200, -200]);

    const rotate = useTransform(
        scrollProgress,
        [startPosition / 100, endPosition / 100],
        [isLeft ? -6 : 6, isLeft ? 6 : -6]
    );

    const scale = useTransform(
        scrollProgress,
        [(startPosition - 10) / 100, startPosition / 100, endPosition / 100, (endPosition + 10) / 100],
        [0.8, 1, 1, 0.8]
    );

    const opacity = useTransform(
        scrollProgress,
        [(startPosition - 10) / 100, startPosition / 100, endPosition / 100, (endPosition + 10) / 100],
        [0, 1, 1, 0]
    );

    return (
        <motion.div
            ref={photoRef}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
                duration: 1.2,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
            }}
            className="sticky top-24 w-full px-6 py-12"
            style={{
                top: `${20 + (index % 4) * 6}vh`, // stagger lebih lembut
            }}
        >
            <motion.div
                style={{
                    y,
                    rotate,
                    scale,
                    opacity,
                    x: isLeft ? '-8%' : '8%',
                }}
                className={`max-w-sm mx-auto ${isLeft ? 'mr-auto' : 'ml-auto'}`}
            >
                <motion.div
                    whileHover={{
                        scale: 1.04,
                        rotate: isLeft ? -1.5 : 1.5,
                        transition: { duration: 0.4 },
                    }}
                    className="group relative"
                >
                    {/* Soft hover glow */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-rose-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-700" />

                    {/* Photo card */}
                    <div className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-zinc-900/80 shadow-2xl shadow-black/50 border border-white/5 backdrop-blur-sm">
                        <img
                            src={photo.src}
                            alt={photo.alt}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                        {/* Caption */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="absolute bottom-0 left-0 right-0 p-6 text-white"
                        >
                            <p className="text-sm font-light tracking-wide drop-shadow-lg">{photo.alt}</p>
                        </motion.div>

                        {/* Subtle border glow */}
                        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}