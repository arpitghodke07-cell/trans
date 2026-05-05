"use client";

import { useEffect, useRef, useState } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

interface TransformerScrollCanvasProps {
  scrollYProgress: MotionValue<number>;
  totalFrames: number;
  imageFolderPath: string;
}

export default function TransformerScrollCanvas({
  scrollYProgress,
  totalFrames,
  imageFolderPath,
}: TransformerScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const currentFrameRef = useRef(0);

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let loadedCount = 0;

      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        img.src = `${imageFolderPath}${i}.jpg`;
        
        // Use a promise to wait for each image to either load or fail
        // This ensures the array stays in order. If missing, we still push the img.
        await new Promise<void>((resolve) => {
          img.onload = () => {
            loadedCount++;
            resolve();
          };
          img.onerror = () => {
            // If image fails (e.g., missing 2-204), we still resolve so it continues
            // We can optionally use the 1.jpg fallback for missing ones
            img.src = `${imageFolderPath}1.jpg`; 
            resolve();
          };
        });
        
        loadedImages.push(img);
      }

      setImages(loadedImages);
      setImagesLoaded(true);
    };

    loadImages();
  }, [totalFrames, imageFolderPath]);

  // Handle resizing and DPI scaling
  const setCanvasDimensions = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    // Redraw current frame
    if (images.length > 0) {
      drawFrame(currentFrameRef.current);
    }
  };

  useEffect(() => {
    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);
    return () => window.removeEventListener("resize", setCanvasDimensions);
  }, [imagesLoaded]);

  // Object-fit: contain logic
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = images[frameIndex];

    if (!canvas || !ctx || !img || !img.complete) return;

    const rect = canvas.getBoundingClientRect();
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Calculate dimensions for object-fit: contain
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      // Image is wider than canvas
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      // Image is taller than canvas
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Sync scroll with frame
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!imagesLoaded) return;
    
    // Calculate frame index (0 to totalFrames - 1)
    let frameIndex = Math.floor(latest * totalFrames);
    
    // Constrain to valid array indices
    if (frameIndex < 0) frameIndex = 0;
    if (frameIndex >= totalFrames) frameIndex = totalFrames - 1;

    currentFrameRef.current = frameIndex;
    
    // Draw via rAF to ensure smooth rendering
    requestAnimationFrame(() => {
      drawFrame(frameIndex);
    });
  });

  // Initial draw once loaded
  useEffect(() => {
    if (imagesLoaded) {
      requestAnimationFrame(() => {
        drawFrame(0);
      });
    }
  }, [imagesLoaded]);

  return (
    <div className="w-full h-full relative bg-base-dark">
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-accent-metal font-headings tracking-widest text-sm z-10 bg-base-dark">
          INITIALIZING CORE SYSTEMS...
        </div>
      )}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
