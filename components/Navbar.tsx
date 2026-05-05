"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function Navbar() {
  const { scrollY } = useScroll();
  
  // Subtle glassmorphism transition after scrolling past 50px
  const bgOpacity = useTransform(scrollY, [0, 50], [0, 0.8]);
  const blurValue = useTransform(scrollY, [0, 50], [0, 8]);
  const borderColor = useTransform(scrollY, [0, 50], ["rgba(255,255,255,0)", "rgba(255,255,255,0.05)"]);

  return (
    <motion.header
      style={{
        backgroundColor: useTransform(bgOpacity, (v) => `rgba(11, 11, 11, ${v})`),
        backdropFilter: useTransform(blurValue, (v) => `blur(${v}px)`),
        WebkitBackdropFilter: useTransform(blurValue, (v) => `blur(${v}px)`),
        borderBottom: useTransform(borderColor, (v) => `1px solid ${v}`),
      }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 pointer-events-auto"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-accent-metal rotate-45 transform origin-center flex items-center justify-center">
          <div className="w-3 h-3 bg-base-dark" />
        </div>
        <span className="font-headings font-bold text-white tracking-widest text-sm uppercase ml-2">
          Nexus
        </span>
      </div>

      <button className="text-white font-headings text-xs tracking-[0.2em] px-4 py-2 border border-neutral-carbon hover:border-accent-metal hover:text-accent-metal transition-colors duration-300">
        INQUIRE
      </button>
    </motion.header>
  );
}
