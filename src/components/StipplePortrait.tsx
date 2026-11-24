import React, { useRef, useEffect, useState } from "react";

interface StipplePortraitProps {
  imageSrc: string;
  className?: string;
}

const StipplePortrait: React.FC<StipplePortraitProps> = ({
  imageSrc,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [spotlightPos, setSpotlightPos] = useState({ x: -200, y: -200 });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let targetX = -200;
    let targetY = -200;
    let currentX = -200;
    let currentY = -200;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    let points: { x: number; y: number; baseR: number; alpha: number }[] = [];

    img.onload = () => {
      setImageLoaded(true);
      const width = 440;
      const height = 580;

      canvas.width = width;
      canvas.height = height;

      // Offscreen canvas to sample image data
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      // Draw image to cover
      const hRatio = width / img.width;
      const vRatio = height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShiftX = (width - img.width * ratio) / 2;
      const centerShiftY = (height - img.height * ratio) / 2;

      offCtx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShiftX,
        centerShiftY,
        img.width * ratio,
        img.height * ratio
      );

      const imgData = offCtx.getImageData(0, 0, width, height);
      const data = imgData.data;

      // Generate stipple dots grid with high density
      const step = 3.5;
      points = [];

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (Math.floor(y) * width + Math.floor(x)) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];

          if (a > 30) {
            // Calculate luminance
            const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            // Contrast curve
            const adjustedLuma = Math.pow(luma, 1.3);

            if (adjustedLuma > 0.08) {
              const radius = Math.max(0.6, adjustedLuma * 1.85);
              points.push({
                x,
                y,
                baseR: radius,
                alpha: Math.min(1, adjustedLuma * 1.25),
              });
            }
          }
        }
      }

      render();
    };

    const render = () => {
      if (!ctx || points.length === 0) return;

      // Smooth spotlight chase
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      setSpotlightPos({ x: currentX, y: currentY });

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const spotRadius = 130;
      const isDark = document.documentElement.classList.contains("dark") || true;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const dist = Math.hypot(p.x - currentX, p.y - currentY);

        let r = p.baseR;
        let alpha = p.alpha;

        // If cursor is near, dots brighten and expand slightly
        if (dist < spotRadius) {
          const proximity = 1 - dist / spotRadius;
          r += proximity * 0.8;
          alpha = Math.min(1, alpha + proximity * 0.4);
        }

        ctx.fillStyle = isDark
          ? `rgba(235, 235, 240, ${alpha * 0.85})`
          : `rgba(20, 20, 25, ${alpha * 0.85})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      targetX = (e.clientX - rect.left) * scaleX;
      targetY = (e.clientY - rect.top) * scaleY;
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      targetX = -200;
      targetY = -200;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [imageSrc]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-2xl group cursor-crosshair ${className}`}
      style={{ width: "100%", maxWidth: "440px", aspectRatio: "440 / 580" }}
    >
      {/* Base Canvas: The interactive stippled point-cloud */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block"
      />

      {/* Spotlight Reveal Layer: Shows realistic photo within cursor spotlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.95 : 0,
          maskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 95%)`,
          WebkitMaskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 95%)`,
        }}
      >
        <img
          src={imageSrc}
          alt="Tanmay Kumar"
          className="w-full h-full object-cover grayscale contrast-125 brightness-95"
          loading="eager"
        />
        {/* Soft edge ambient light ring */}
        <div
          className="absolute w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 pointer-events-none"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        />
      </div>

      {/* Floating subtle badge at bottom right */}
      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/70 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        Interactive Stipple
      </div>
    </div>
  );
};

export default StipplePortrait;
