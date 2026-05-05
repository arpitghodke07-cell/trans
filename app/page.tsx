"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import Navbar from "../components/Navbar";
import TransformerScrollCanvas from "../components/TransformerScrollCanvas";
import TransformerExperience from "../components/TransformerExperience";
import { transformerData } from "../data/transformerData";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Single scroll source of truth for the entire sequence
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <main className="bg-base-dark min-h-screen">
      <Navbar />

      {/* Screen reader text for accessibility */}
      <div className="sr-only">
        <h1>{transformerData.phase1.systemReadout}</h1>
        <p>{transformerData.phase1.subtitle}</p>
        <p>A scroll-driven cinematic sequence showing a mechanical truck transforming into a humanoid robot.</p>
      </div>

      {/* 
        Scroll sequence locked for 500vh 
        We use an inline style for the height as defined in transformerData
      */}
      <section 
        ref={containerRef} 
        style={{ height: transformerData.scrollLength }} 
        className="relative w-full"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-base-dark">
          {/* Layer 1: The Sequence Canvas */}
          <TransformerScrollCanvas 
            scrollYProgress={scrollYProgress}
            totalFrames={transformerData.totalFrames}
            imageFolderPath={transformerData.imageFolderPath}
          />
          
          {/* Layer 2: The HUD Overlay */}
          <TransformerExperience scrollYProgress={scrollYProgress} />
        </div>
      </section>

      {/* Post-sequence content */}
      <div className="relative z-20 bg-base-dark min-h-screen flex items-center justify-center border-t border-neutral-carbon">
        <div className="text-center px-6">
          <h3 className="font-headings text-2xl text-white uppercase tracking-widest mb-4">
            System Diagnostics Complete
          </h3>
          <p className="font-body text-neutral-400 max-w-lg mx-auto">
            This concludes the interactive transformation sequence. The vehicle-to-humanoid 
            conversion has stabilized at optimal efficiency.
          </p>
        </div>
      </div>
    </main>
  );
}
