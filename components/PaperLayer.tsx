"use client";

import { useEffect, useRef } from "react";
import { generatePaper } from "./paperTexture";

export default function PaperLayer({
  seed = 34,
  strength = 1,
  className = "",
}: {
  seed?: number;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const W = 960;
    const H = 600;
    canvas.width = W;
    canvas.height = H;
    const id = window.setTimeout(() => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const img = ctx.createImageData(W, H);
      img.data.set(generatePaper(W, H, seed));
      ctx.putImageData(img, 0, 0);
      canvas.style.opacity = String(strength);
    }, 50);
    return () => window.clearTimeout(id);
  }, [seed, strength]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ${className}`}
    />
  );
}