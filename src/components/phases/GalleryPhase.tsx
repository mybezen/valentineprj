'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Fungsi shuffle array untuk acak urutan
function shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

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

    // Array untuk floating photos (original, tanpa loop ekstra)
    const floatingPhotos = photos;

    // Array data baru khusus untuk dome gallery (isi dengan data image Anda)
    // Contoh placeholder: tambahkan lebih banyak jika perlu
    const domeImages = [
        { id: 'd1', src: '/images/domepics/d1.jpeg', alt: 'Description 1' },
        { id: 'd2', src: '/images/domepics/d2.jpeg', alt: 'Description 2' },
        { id: 'd3', src: '/images/domepics/d3.jpeg', alt: 'Description 3' },
        { id: 'd4', src: '/images/domepics/d4.jpeg', alt: 'Description 4' },
        { id: 'd5', src: '/images/domepics/d5.jpeg', alt: 'Description 5' },
        { id: 'd6', src: '/images/domepics/d6.jpeg', alt: 'Description 6' },
        { id: 'd7', src: '/images/domepics/d7.jpeg', alt: 'Description 7' },
        { id: 'd8', src: '/images/domepics/d8.jpeg', alt: 'Description 8' },
        { id: 'd9', src: '/images/domepics/d9.jpeg', alt: 'Description 9' },
        { id: 'd10', src: '/images/domepics/d10.jpeg', alt: 'Description 10' },
        { id: 'd11', src: '/images/domepics/d11.jpeg', alt: 'Description 11' },
        { id: 'd12', src: '/images/domepics/d12.jpeg', alt: 'Description 12' },
        { id: 'd13', src: '/images/domepics/d13.jpeg', alt: 'Description 13' },
        { id: 'd14', src: '/images/domepics/d14.jpeg', alt: 'Description 14' },
        { id: 'd15', src: '/images/domepics/d15.jpeg', alt: 'Description 15' },
        { id: 'd16', src: '/images/domepics/d16.jpeg', alt: 'Description 16' },
        { id: 'd17', src: '/images/domepics/d17.jpeg', alt: 'Description 17' },
        { id: 'd18', src: '/images/domepics/d18.jpeg', alt: 'Description 18' },
        { id: 'd19', src: '/images/domepics/d19.jpeg', alt: 'Description 19' },
        { id: 'd20', src: '/images/domepics/d20.jpeg', alt: 'Description 20' },
        { id: 'd21', src: '/images/domepics/d21.jpeg', alt: 'Description 21' },
        { id: 'd22', src: '/images/domepics/d22.jpeg', alt: 'Description 22' },
        { id: 'd23', src: '/images/domepics/d23.jpeg', alt: 'Description 23' },
        // Tambahkan lebih banyak object di sini sesuai kebutuhan
    ];

    // Dynamic looping untuk dome gallery agar ngikutin panjang Y page (min-h-[300vh])
    // Repeat 20 kali, tapi shuffle setiap loop untuk acak total (hindari pola samping-sampingan)
    // Ini buat content super panjang, sehingga looping terasa terus sampai end scroll
    const domeGalleryPhotos = Array.from({ length: 20 }).flatMap(() => shuffle(domeImages));

    return (
        <div ref={containerRef} className="relative min-h-[300vh] w-full bg-black overflow-hidden">
            {/* Dome Gallery Component - Variasi 1: Hitam Putih */}
            <DomeGallery photos={domeGalleryPhotos} scrollProgress={scrollYProgress} variant="grayscale" />

            {/* Dome Gallery Component - Variasi 2: Warna Asli */}
            {/* <DomeGallery photos={domeGalleryPhotos} scrollProgress={scrollYProgress} variant="color" /> */}
            {/* Uncomment variasi kedua di atas untuk testing, dan comment variasi pertama jika perlu switch */}

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
                            Our Journeys
                        </h2>
                        <p className="text-zinc-400 text-sm mt-2">
                            Every moment with you feels timeless babee
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Floating Photos */}
            <div className="relative z-10">
                {floatingPhotos.map((photo, index) => (
                    <FloatingPhoto
                        key={photo.id}
                        photo={photo}
                        index={index}
                        scrollProgress={scrollYProgress}
                        totalPhotos={floatingPhotos.length}
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
                        YEAYYY!!!! kamu uda sampe ending ni
                    </p>

                    {/* Spoiler Section */}
                    <SpoilerSection onContinue={onContinue} />

                </motion.div>

            </div>
        </div>
    );
}

function SpoilerSection({ onContinue }: { onContinue: () => void }) {
    const [isFirstOpen, setIsFirstOpen] = useState(false);
    const [isSecondOpen, setIsSecondOpen] = useState(false);

    return (
        <div className="mt-3 text-center">
            {!isFirstOpen ? (
                <motion.button
                    onClick={() => setIsFirstOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-zinc-800/50 rounded-full text-zinc-300 font-light text-base tracking-wide hover:bg-zinc-700/50 transition-all duration-300 shadow-sm"
                >
                    emang aku senup itu kah sampe selesai segini? coba pencet ini
                </motion.button>
            ) : (
                <>
                    <motion.p
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="text-zinc-500 text-base mb-4"
                    >
                        TAPI BOONK JAJAJAJAJJAJA,
                        aku punya sesuatu yg spesial buat kamu sayang, emang ga seberapa tapi tolong diterima yaa
                    </motion.p>

                    {/* Spoiler Kedua */}
                    {!isSecondOpen ? (
                        <motion.button
                            onClick={() => setIsSecondOpen(true)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-zinc-800/50 rounded-full text-zinc-300 font-light text-base tracking-wide hover:bg-zinc-700/50 transition-all duration-300 shadow-sm"
                        >
                            HAHAHAHA ADA LAGI, PENCET LAGI NI
                        </motion.button>
                    ) : (
                        <motion.button
                            onClick={onContinue}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                            whileTap={{ scale: 0.97 }}
                            className="px-10 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/20 text-white font-light text-lg tracking-wide hover:bg-white/10 hover:border-rose-300/30 transition-all duration-400 shadow-sm hover:shadow-md"
                        >
                            <span className="flex items-center justify-center gap-3">
                                mau liat plis apa ni
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
                    )}
                </>
            )}
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
    const imgRef = useRef<HTMLImageElement>(null);
    const [aspectClass, setAspectClass] = useState('aspect-[9/16]'); // Default portrait

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

    // Detect aspect ratio on image load
    useEffect(() => {
        const img = imgRef.current;
        if (img) {
            const handleLoad = () => {
                if (img.naturalWidth > img.naturalHeight) {
                    // Landscape (e.g., 16:9 or wider)
                    setAspectClass('aspect-[16/9]');
                } else {
                    // Portrait or square
                    setAspectClass('aspect-[9/16]');
                }
            };

            if (img.complete) {
                handleLoad();
            } else {
                img.addEventListener('load', handleLoad);
                return () => img.removeEventListener('load', handleLoad);
            }
        }
    }, [photo.src]);

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
                    <div className={`relative ${aspectClass} rounded-3xl overflow-hidden bg-zinc-900/80 shadow-2xl shadow-black/50 border border-white/5 backdrop-blur-sm`}>
                        <img
                            ref={imgRef}
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

interface DomeGalleryProps {
    photos: Array<{ id: string; src: string; alt: string }>;
    scrollProgress: any;
    variant: 'grayscale' | 'color'; // Variasi untuk testing
}

function DomeGallery({ photos, scrollProgress, variant }: DomeGalleryProps) {
    const galleryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!galleryRef.current) return;

        // GSAP ScrollTrigger untuk scroll lebih lelet (lambat)
        // Ubah scrub ke 1.5 (1.5 detik delay smooth) untuk feel lebih lelet
        // y: '-200%' untuk gerak lebih jauh, memastikan looping sampai end scroll (karena content panjang dari repeat)
        gsap.to(galleryRef.current, {
            y: '-15%', // Gerak lebih jauh: -200% berarti gallery scroll 2x kecepatan, tapi dengan content panjang, akan cover full sampai end
            ease: 'none',
            scrollTrigger: {
                trigger: galleryRef.current.parentElement,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1, // Scrub 1.5 detik untuk lebih lelet/smooth di mobile
                pin: false, // Tidak pin, biar ikut scroll natural
            },
        });
    }, []);

    return (
        <div
            ref={galleryRef}
            className="absolute inset-0 z-[5] pointer-events-none overflow-hidden columns-2 gap-2 p-2" // Fokus mobile: columns-2, no md/lg untuk simplicity
            style={{
                // CSS masonry via columns, balance untuk mobile
                columnFill: 'balance',
            }}
        >
            {photos.map((photo, index) => (
                <DomeImage
                    key={`${photo.id}-${index}`}
                    photo={photo}
                    variant={variant}
                />
            ))}
        </div>
    );
}

interface DomeImageProps {
    photo: { id: string; src: string; alt: string };
    variant: 'grayscale' | 'color';
}

function DomeImage({ photo, variant }: DomeImageProps) {
    const imgRef = useRef<HTMLImageElement>(null);
    const [aspectStyle, setAspectStyle] = useState({}); // Dynamic aspect ratio

    useEffect(() => {
        const img = imgRef.current;
        if (img) {
            const handleLoad = () => {
                const ratio = img.naturalWidth / img.naturalHeight;
                setAspectStyle({ aspectRatio: `${ratio}` });
            };

            if (img.complete) {
                handleLoad();
            } else {
                img.addEventListener('load', handleLoad);
                return () => img.removeEventListener('load', handleLoad);
            }
        }
    }, [photo.src]);

    return (
        <div
            className="mb-2 break-inside-avoid rounded-lg overflow-hidden shadow-md"
            style={aspectStyle} // Dynamic aspect ratio
        >
            <img
                ref={imgRef}
                src={photo.src}
                alt={photo.alt}
                className={`w-full h-full object-cover ${variant === 'grayscale' ? 'grayscale' : ''}`}
                loading="lazy" // Lazy loading gambar
            />
        </div>
    );
}