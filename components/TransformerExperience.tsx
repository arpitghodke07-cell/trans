"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { transformerData } from "../data/transformerData";
import { useEffect, useState } from "react";

interface TransformerExperienceProps {
  scrollYProgress: MotionValue<number>;
}

export default function TransformerExperience({
  scrollYProgress,
}: TransformerExperienceProps) {
  // Phase 1: 0% - 30%
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.25, 0.3], [0, 1, 1, 0]);
  const phase1Y = useTransform(scrollYProgress, [0, 0.3], [20, -20]);

  // Phase 2: 30% - 75%
  const phase2Opacity = useTransform(scrollYProgress, [0.3, 0.35, 0.7, 0.75], [0, 1, 1, 0]);
  
  // Phase 3: 75% - 100%
  const phase3Opacity = useTransform(scrollYProgress, [0.75, 0.8, 1], [0, 1, 1]);
  const phase3Y = useTransform(scrollYProgress, [0.75, 0.9], [20, 0]);

  // Derived dynamic frame number for Phase 2
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      let frame = Math.floor(latest * transformerData.totalFrames);
      if (frame < 0) frame = 0;
      if (frame > transformerData.totalFrames) frame = transformerData.totalFrames;
      setCurrentFrame(frame);
    });
  }, [scrollYProgress]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 p-6 md:p-12 flex flex-col justify-between">
      
      {/* Top Section */}
      <div className="flex justify-between items-start pt-16">
        {/* Phase 2: Diagnostics (Left) */}
        <motion.div 
          style={{ opacity: phase2Opacity }}
          className="font-headings text-accent-metal text-xs tracking-widest uppercase flex flex-col gap-1"
        >
          <span>{transformerData.phase2.systemStatus}</span>
          <span className="text-white">
            {transformerData.phase2.framePrefix} {String(currentFrame).padStart(3, "0")} / {transformerData.totalFrames}
          </span>
        </motion.div>
      </div>

      {/* Middle Section (Edge Rails) */}
      <div className="absolute top-1/2 left-6 transform -translate-y-1/2 flex items-center h-full max-h-[50vh]">
        {/* Decorative rails or subtle indicators could go here */}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center justify-end pb-12 w-full relative">
        
        {/* Phase 1: Presence */}
        <motion.div 
          style={{ opacity: phase1Opacity, y: phase1Y }}
          className="absolute bottom-12 flex flex-col items-center text-center w-full"
        >
          <h1 className="font-headings text-3xl md:text-5xl font-bold text-white tracking-widest uppercase mb-2">
            {transformerData.phase1.systemReadout}
          </h1>
          <p className="font-body text-neutral-400 tracking-[0.3em] text-sm uppercase">
            {transformerData.phase1.subtitle}
          </p>
        </motion.div>

        {/* Phase 3: Arrival */}
        <motion.div 
          style={{ opacity: phase3Opacity, y: phase3Y }}
          className="absolute bottom-12 flex flex-col items-center text-center w-full pointer-events-auto"
        >
          <h2 className="font-headings text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2">
            {transformerData.phase3.headline}
          </h2>
          <p className="font-body text-accent-metal font-bold tracking-[0.5em] text-sm mb-8">
            {transformerData.phase3.signature}
          </p>
          
          <button className="relative group overflow-hidden px-8 py-3 border border-neutral-carbon bg-base-dark text-white font-headings text-xs tracking-[0.2em] transition-all duration-300 hover:border-white">
            <span className="relative z-10">{transformerData.phase3.ctaLabel}</span>
            <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            <span className="absolute inset-0 z-20 flex items-center justify-center text-base-dark opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-headings text-xs tracking-[0.2em]">
              {transformerData.phase3.ctaLabel}
            </span>
          </button>
        </motion.div>

      </div>
    </div>
  );
}
