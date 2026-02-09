'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { floatVariants } from '../../lib/animations';
import Image from 'next/image';

interface FloatingPhotoProps {
  src: string;
  alt: string;
  index: number;
}

export default function FloatingPhoto({ src, alt, index }: FloatingPhotoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const delay = index * 0.15;

  return (
    <motion.div
      ref={ref}
      variants={floatVariants(delay)}
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay, duration: 0.6 }}
      animate="animate"
      style={{ y }}
      className="relative w-48 h-72 rounded-2xl overflow-hidden shadow-2xl"
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="192px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </motion.div>
  );
}