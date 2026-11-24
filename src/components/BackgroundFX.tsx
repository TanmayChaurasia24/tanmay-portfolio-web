import React, { useEffect, useRef } from "react";

const BackgroundFX: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!rafRef.current) tick();
    };

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.15;
      current.current.y += (target.current.y - current.current.y) * 0.15;
      if (ref.current) {
        ref.current.style.setProperty("--x", `${current.current.x}px`);
        ref.current.style.setProperty("--y", `${current.current.y}px`);
      }
      rafRef.current = requestAnimationFrame(() => {
        if (Math.hypot(target.current.x - current.current.x, target.current.y - current.current.y) < 0.5) {
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
          }
          rafRef.current = null;
          return;
        }
        tick();
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        // Layer 1: beams following cursor
        background:
          `radial-gradient(120px 120px at var(--x, -100px) var(--y, -100px), hsl(var(--accent-blue) / 0.25), transparent 60%),` +
          `radial-gradient(280px 220px at calc(var(--x, -100px) + 120px) calc(var(--y, -100px) + 80px), hsl(var(--accent-purple) / 0.18), transparent 60%),` +
          // Layer 2: subtle grid with mask
          `linear-gradient(transparent 0 1px, transparent 1px), linear-gradient(90deg, transparent 0 1px, transparent 1px)`,
        backgroundSize: "auto, auto, 24px 24px, 24px 24px",
        backgroundPosition: "0 0, 0 0, 0 0, 0 0",
        maskImage:
          "radial-gradient(600px 600px at var(--x, -100px) var(--y, -100px), rgba(0,0,0,0.9), rgba(0,0,0,0.4) 50%, transparent 70%)",
        WebkitMaskImage:
          "radial-gradient(600px 600px at var(--x, -100px) var(--y, -100px), rgba(0,0,0,0.9), rgba(0,0,0,0.4) 50%, transparent 70%)",
      }}
    >
      {/* Floating blurred orbs for depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-3xl animate-float" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-accent/10 blur-3xl animate-pulse-soft" />
    </div>
  );
};

export default BackgroundFX;
