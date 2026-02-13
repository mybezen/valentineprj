'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DndContext,
    useDraggable,
    useDroppable,
    DragEndEvent,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { gsap } from 'gsap';
import { forwardRef } from 'react'; // Add this import if not already present

interface GiftPhaseProps {
    giftImageSrc: string;
    giftLink: string; // Added prop for Google Drive link
    onContinue: () => void; // New prop for continuing to next phase
}

export default function GiftPhase({ giftImageSrc, giftLink, onContinue }: GiftPhaseProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [ribbonRemoved, setRibbonRemoved] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isDraggingRibbon, setIsDraggingRibbon] = useState(false);
    const [showPrank, setShowPrank] = useState(true); // State for prank phase

    const prankRef = useRef<HTMLDivElement>(null);
    const realRef = useRef<HTMLDivElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 }, // better touch experience
        })
    );

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
        if (event.active.id === 'ribbon') {
            setIsDraggingRibbon(true);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        setIsDraggingRibbon(false);
        if (event.over?.id === 'dropzone') {
            setRibbonRemoved(true);
            setTimeout(() => setIsRevealed(true), 500);
        }
    };

    // GSAP transition from prank to real after 3 seconds
    useEffect(() => {
        if (isRevealed && showPrank) {
            const tl = gsap.timeline({
                onComplete: () => setShowPrank(false),
            });

            tl.to(prankRef.current, {
                opacity: 0,
                y: 50,
                duration: 1.2,
                ease: 'power2.out',
                delay: 3, // Wait 3 seconds before transitioning
            });
        }
    }, [isRevealed, showPrank]);

    // GSAP entrance for real gift
    useEffect(() => {
        if (isRevealed && !showPrank) {
            gsap.fromTo(
                realRef.current,
                { opacity: 0, y: -50, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'elastic.out(1, 0.5)' }
            );
        }
    }, [isRevealed, showPrank]);

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
        >
            <div className="relative min-h-screen w-full bg-gradient-to-b from-black to-zinc-950 flex flex-col items-center justify-center px-5 sm:px-8 overflow-hidden touch-pan-y">
                {/* Soft ambient glow - toned down to gray */}
                <motion.div
                    className="fixed inset-0 bg-gradient-radial from-zinc-500/5 via-transparent to-transparent pointer-events-none"
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Instruction header */}
                {!isRevealed && (
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-10 sm:top-16 left-0 right-0 text-center z-20 px-6"
                    >
                        <h3 className="text-3xl sm:text-4xl font-light text-white tracking-wide mb-3">
                            presented for u
                        </h3>
                        <p className="text-zinc-400 text-base sm:text-lg">
                            tarik pitanya ke bawah babee!!
                        </p>
                    </motion.div>
                )}

                {/* Main content area */}
                <div className="relative w-full max-w-sm sm:max-w-md flex-1 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {!isRevealed ? (
                            <motion.div
                                key="gift"
                                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.5 } }}
                                className="relative"
                            >
                                <GiftBox ribbonRemoved={ribbonRemoved} isDragging={isDraggingRibbon} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="revealed"
                                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full px-4 sm:px-0"
                            >
                                {showPrank ? (
                                    <PrankGift ref={prankRef} />
                                ) : (
                                    <RealGift ref={realRef} imageSrc={giftImageSrc} giftLink={giftLink} onContinue={onContinue} />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Drop zone */}
                {!isRevealed && <DropZone />}
            </div>

            <DragOverlay dropAnimation={null}>
                {activeId === 'ribbon' && <DraggableRibbonOverlay />}
            </DragOverlay>
        </DndContext>
    );
}

function GiftBox({ ribbonRemoved, isDragging }: { ribbonRemoved: boolean; isDragging: boolean }) {
    return (
        <div className="relative scale-90 sm:scale-100">
            <motion.div
                animate={ribbonRemoved ? { scale: [1, 1.04, 1] } : { scale: [1, 1.015, 1] }}
                transition={{
                    duration: ribbonRemoved ? 0.6 : 4,
                    repeat: ribbonRemoved ? 0 : Infinity,
                    ease: 'easeInOut',
                }}
                className="relative w-72 h-72 sm:w-80 sm:h-80 bg-gradient-to-br from-zinc-400 via-zinc-500 to-zinc-600 rounded-3xl shadow-2xl shadow-zinc-600/40"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 rounded-3xl" />
                <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20" />

                <AnimatePresence>
                    {!ribbonRemoved && (
                        <>
                            {/* Vertical ribbon part - fades when dragging */}
                            <motion.div
                                animate={{
                                    opacity: isDragging ? 0.35 : 1,
                                    scale: isDragging ? 0.92 : 1,
                                }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 bg-gradient-to-r from-zinc-600 to-zinc-700 shadow-xl origin-center"
                            />
                            {/* Horizontal ribbon part - fades when dragging */}
                            <motion.div
                                animate={{
                                    opacity: isDragging ? 0.35 : 1,
                                    scale: isDragging ? 0.92 : 1,
                                }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 bg-gradient-to-b from-zinc-600 to-zinc-700 shadow-xl origin-center"
                            />
                        </>
                    )}
                </AnimatePresence>
            </motion.div>

            {!ribbonRemoved && <DraggableRibbon />}
        </div>
    );
}

function DraggableRibbon() {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: 'ribbon',
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="absolute -top-20 left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing touch-none z-50"
        >
            <motion.div
                animate={isDragging ? { scale: 1.12 } : { y: [0, -6, 0], scale: 1 }}
                transition={{
                    y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
                    scale: { duration: 0.25 },
                }}
                className="relative"
            >
                <div className="w-32 h-24 relative">
                    <div className="absolute left-1 top-0 w-14 h-16 bg-gradient-to-br from-zinc-400 to-zinc-500 rounded-full -rotate-45 shadow-lg" />
                    <div className="absolute right-1 top-0 w-14 h-16 bg-gradient-to-bl from-zinc-400 to-zinc-500 rounded-full rotate-45 shadow-lg" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-600 rounded-full shadow-inner ring-2 ring-white/30" />

                    <div className="absolute top-14 left-1/2 -translate-x-1/2 flex gap-3">
                        <div className="w-4 h-14 bg-gradient-to-b from-zinc-500 to-zinc-600 rounded-b shadow-md -rotate-10" />
                        <div className="w-4 h-14 bg-gradient-to-b from-zinc-500 to-zinc-600 rounded-b shadow-md rotate-10" />
                    </div>
                </div>

                {!isDragging && (
                    <motion.p
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                        className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm text-zinc-300 font-medium"
                    >
                        Pull me ↓
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
}

function DraggableRibbonOverlay() {
    return (
        <div className="relative opacity-100 scale-110 pointer-events-none">
            <div className="w-32 h-24 relative">
                <div className="absolute left-1 top-0 w-14 h-16 bg-gradient-to-br from-zinc-400 to-zinc-500 rounded-full -rotate-45 shadow-2xl" />
                <div className="absolute right-1 top-0 w-14 h-16 bg-gradient-to-bl from-zinc-400 to-zinc-500 rounded-full rotate-45 shadow-2xl" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-600 rounded-full shadow-inner ring-2 ring-white/40" />

                <div className="absolute top-14 left-1/2 -translate-x-1/2 flex gap-3">
                    <div className="w-4 h-14 bg-gradient-to-b from-zinc-500 to-zinc-600 rounded-b shadow-lg -rotate-10" />
                    <div className="w-4 h-14 bg-gradient-to-b from-zinc-500 to-zinc-600 rounded-b shadow-lg rotate-10" />
                </div>
            </div>
        </div>
    );
}

function DropZone() {
    const { setNodeRef, isOver } = useDroppable({ id: 'dropzone' });

    return (
        <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 px-5 z-30">
            <motion.div
                ref={setNodeRef}
                animate={{
                    scale: isOver ? 1.06 : 1,
                    borderColor: isOver ? '#a1a1aa' : '#4b5563',
                    backgroundColor: isOver ? 'rgba(30,30,40,0.7)' : 'rgba(20,20,30,0.4)',
                }}
                className="max-w-sm sm:max-w-md mx-auto h-28 rounded-3xl border-2 border-dashed backdrop-blur-md flex items-center justify-center transition-colors"
            >
                <div className="text-center">
                    <motion.div
                        animate={{ y: isOver ? -8 : 0, scale: isOver ? 1.25 : 1 }}
                        className="text-5xl mb-2"
                    >
                        {isOver ? '✨' : '↓'}
                    </motion.div>
                    <p className="text-sm sm:text-base font-medium text-zinc-300">
                        {isOver ? 'lepas disini biar bisa kebuka' : 'tarik kesinii babee'}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

// New PrankGift component
const PrankGift = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <div ref={ref} className="w-full max-w-md mx-auto relative">
            {/* Prank elements */}
            {['🤡', '🎭', '😜'].map((emoji, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, y: 0 }}
                    animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1.4, 0.8],
                        y: -120 - i * 30,
                        x: (i - 1) * 60,
                    }}
                    transition={{ duration: 3.5, delay: i * 0.4, ease: 'easeOut' }}
                    className="absolute top-1/3 left-1/2 text-4xl sm:text-5xl pointer-events-none"
                >
                    {emoji}
                </motion.div>
            ))}

            <motion.div
                className="relative aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-zinc-500/30 border border-white/10 bg-zinc-900"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Prank content - large toy emoji or placeholder */}
                <div className="w-full h-full flex items-center justify-center text-9xl">
                    🧸 {/* Or any prank toy emoji */}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="text-white text-xl sm:text-2xl font-light tracking-wide leading-relaxed"
                    >
                        TAPI BOONK! JAJAJAJA
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="text-zinc-400 text-base mt-2"
                    >
                        prenkkkkk
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
});
PrankGift.displayName = 'PrankGift';

// Add interface for RealGift props
interface RealGiftProps {
    imageSrc: string;
    giftLink: string;
    onContinue: () => void; // New prop for continuing
}

// Modified RealGift component with proper typing and image loader
const RealGift = forwardRef<HTMLDivElement, RealGiftProps>(({ imageSrc, giftLink, onContinue }, ref) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false); // New state for image loading

    const handleLanjut = () => {
        setModalOpen(false);
        onContinue(); // Trigger next phase on "Lanjut"
    };

    return (
        <div ref={ref} className="w-full max-w-md mx-auto relative">
            {/* Real floating elements */}
            {['❤️', '✨', '💫'].map((emoji, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, y: 0 }}
                    animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1.4, 0.8],
                        y: -120 - i * 30,
                        x: (i - 1) * 60,
                    }}
                    transition={{ duration: 3.5, delay: i * 0.4, ease: 'easeOut' }}
                    className="absolute top-1/3 left-1/2 text-4xl sm:text-5xl pointer-events-none"
                >
                    {emoji}
                </motion.div>
            ))}

            <motion.div
                className="relative aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-zinc-500/30 border border-white/10 bg-zinc-900 cursor-pointer"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setModalOpen(true)}
            >
                {/* Image Loader */}
                <AnimatePresence>
                    {!isImageLoaded && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10"
                        >
                            <motion.div
                                className="w-16 h-16 border-4 border-zinc-500 border-t-white rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Gift Image with fade-in */}
                <img
                    src={imageSrc}
                    alt="Your special gift"
                    className={`w-full h-full object-contain transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setIsImageLoaded(true)}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            </motion.div>

            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-zinc-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="text-white text-xl sm:text-2xl font-light tracking-wide leading-relaxed"
                            >
                                HAII SAYANGGG
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="text-zinc-400 text-base mt-2"
                            >
                                ni ada gdrivenya juga untuk soft filenya
                            </motion.p>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6, type: 'spring', stiffness: 180 }}
                                className="mt-6 text-5xl sm:text-6xl"
                            >
                                <motion.span
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    🐻‍❄️
                                </motion.span>
                            </motion.div>

                            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                                <button
                                    onClick={handleLanjut}
                                    className="px-6 py-3 bg-zinc-700/50 rounded-full text-white font-light text-base tracking-wide hover:bg-zinc-600/50 transition-all duration-300 shadow-sm"
                                >
                                    lanjut aja ah
                                </button>
                                <a
                                    href={giftLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-zinc-700/50 rounded-full text-white font-light text-base tracking-wide hover:bg-zinc-600/50 transition-all duration-300 shadow-sm"
                                >
                                    mau ke gdrive duluu
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});
RealGift.displayName = 'RealGift';