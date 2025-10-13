import React, { useEffect, useRef } from "react";

const isTouch = () => typeof window !== 'undefined' && matchMedia('(pointer: coarse)').matches;

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (isTouch()) return; // don't show on touch devices

    document.body.classList.add('cursor-none');

    const move = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!raf.current) animate();
    };

    const down = () => {
      ringRef.current?.classList.add('scale-75', 'opacity-80');
      dotRef.current?.classList.add('scale-50');
    };
    const up = () => {
      ringRef.current?.classList.remove('scale-75', 'opacity-80');
      dotRef.current?.classList.remove('scale-50');
    };

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      raf.current = requestAnimationFrame(() => {
        if (Math.hypot(target.current.x - pos.current.x, target.current.y - pos.current.y) < 0.5) {
          raf.current && cancelAnimationFrame(raf.current);
          raf.current = null;
          return;
        }
        animate();
      });
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);

    return () => {
      document.body.classList.remove('cursor-none');
      window.removeEventListener('mousemove', move as any);
      window.removeEventListener('mousedown', down as any);
      window.removeEventListener('mouseup', up as any);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  if (isTouch()) return null;

  return (
    <div aria-hidden>
      <div ref={ringRef} className="pointer-events-none fixed left-0 top-0 -translate-x-1/2 -translate-y-1/2 z-50 h-10 w-10 rounded-full border border-white/60 dark:border-white/30 mix-blend-difference opacity-60 transition-transform duration-150" />
      <div ref={dotRef} className="pointer-events-none fixed left-0 top-0 -translate-x-1/2 -translate-y-1/2 z-50 h-2.5 w-2.5 rounded-full bg-white mix-blend-difference" />
    </div>
  );
};

export default CustomCursor;
