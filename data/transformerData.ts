export const transformerData = {
  totalFrames: 204,
  scrollLength: "500vh",
  imageFolderPath: "./images/transformer-sequence/",
  
  // Phase 1: 0% - 30%
  phase1: {
    systemReadout: "TRANSFORMATION SEQUENCE",
    subtitle: "FRAME-BY-FRAME CINEMATIC DIRECTION",
  },
  
  // Phase 2: 30% - 75%
  phase2: {
    systemStatus: "SYSTEM: SHIFTING — CORE ENGAGED",
    // We can compute the frame index dynamically based on scroll, 
    // but here we can define prefix/suffix if needed.
    framePrefix: "FRAME",
  },
  
  // Phase 3: 75% - 100%
  phase3: {
    headline: "CINEMATIC TRANSFORMATION",
    signature: "DIRECTED BY ARP",
    ctaLabel: "EXPLORE PORTFOLIO",
  },
};
