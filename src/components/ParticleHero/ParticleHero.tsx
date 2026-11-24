/**
 * ParticleHero — The main React component.
 *
 * Full-viewport hero with:
 *   - Three.js particle portrait canvas (background layer)
 *   - Header overlay (name, role, nav, available badge, menu button)
 *   - Headline block (right side, desktop)
 *   - Globe widget (left side)
 *   - Bottom pill switcher
 *   - Custom cursor (10px white dot, mix-blend-mode: difference)
 *   - GSAP text reveal animations
 *   - Lenis smooth scroll + ScrollTrigger for dissolve
 *
 * Everything is wired from the config — see ./config.ts
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ParticleScene } from "./particleScene";
import { CONFIG } from "./config";
import GlobeWidget from "../GlobeWidget";
import portfolioData from "../../data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

/* ─── Types ────────────────────────────────────────── */
interface ParticleHeroProps {
  onMenuOpen: () => void;
}

const HEADLINE_WORDS = [
  "I", "build", "software", "and", "automate",
  "the", "work", "behind", "your", "business."
];

/* ─── Component ────────────────────────────────────── */
const ParticleHero: React.FC<ParticleHeroProps> = ({ onMenuOpen }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ParticleScene | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Header refs
  const headerRef = useRef<HTMLElement>(null);
  // Headline refs
  const headlineRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  // Widget refs
  const globeRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  // About teaser refs
  const aboutRuleRef = useRef<HTMLDivElement>(null);
  const aboutTextRef = useRef<HTMLDivElement>(null);
  // Scroll menu button ref
  const scrollMenuRef = useRef<HTMLButtonElement>(null);

  const [sceneReady, setSceneReady] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const colorPortraitRef = useRef<HTMLDivElement>(null);
  const isMouseInsideRef = useRef(false);
  const cursorPos = useRef({ x: -100, y: -100 });
  const cursorSmooth = useRef({ x: -100, y: -100 });
  const cursorRaf = useRef<number | null>(null);

  const layoutRef = useRef({
    portraitW: 0,
    portraitH: 0,
    offsetX: 0,
    offsetY: 0,
  });
  const scrollProgressRef = useRef(0);

  const updatePortraitLayout = useCallback(() => {
    const h = window.innerHeight;
    const w = window.innerWidth;
    const isMobile = w < CONFIG.MOBILE_BREAKPOINT;
    const heightRatio = isMobile ? 0.65 : CONFIG.PORTRAIT_HEIGHT_RATIO;
    const xOffset = isMobile ? 0.0 : CONFIG.PORTRAIT_X_OFFSET;
    const portraitH = h * heightRatio;
    const portraitW = (portraitH / 1024) * 768;
    const offsetX = w * (0.5 + xOffset) - portraitW / 2;
    const offsetY = h - portraitH;
    layoutRef.current = { portraitW, portraitH, offsetX, offsetY };

    if (colorPortraitRef.current) {
      colorPortraitRef.current.style.width = `${portraitH * (768 / 1024)}px`;
      colorPortraitRef.current.style.height = `${portraitH}px`;
      colorPortraitRef.current.style.left = `${offsetX}px`;
      colorPortraitRef.current.style.top = `${offsetY}px`;
    }
  }, []);

  /* ── WebGL Scene Setup ────────────────────────────── */
  useEffect(() => {
    if (!canvasRef.current) return;

    updatePortraitLayout();

    const scene = new ParticleScene({
      canvas: canvasRef.current,
      imageSrc: "/tanmay-cutout.png",
      onReady: () => setSceneReady(true),
    });
    scene.initCamera();
    sceneRef.current = scene;

    const handleResize = () => {
      scene.resize();
      updatePortraitLayout();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      scene.dispose();
      sceneRef.current = null;
    };
  }, [updatePortraitLayout]);

  /* ── Cursor Tracking (canvas + custom dot) ─────── */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onMouseMove = (e: MouseEvent) => {
      isMouseInsideRef.current = true;
      setShowCursor(true);
      sceneRef.current?.setMouse(e.clientX, e.clientY);
      cursorPos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseEnter = () => {
      isMouseInsideRef.current = true;
      setShowCursor(true);
    };
    const onMouseLeave = () => {
      isMouseInsideRef.current = false;
      setShowCursor(false);
      sceneRef.current?.clearMouse();
    };

    // Touch support
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      isMouseInsideRef.current = true;
      setShowCursor(true);
      sceneRef.current?.setMouse(touch.clientX, touch.clientY);
      cursorPos.current = { x: touch.clientX, y: touch.clientY };
    };
    const onTouchEnd = () => {
      isMouseInsideRef.current = false;
      sceneRef.current?.clearMouse();
    };

    hero.addEventListener("mousemove", onMouseMove);
    hero.addEventListener("mouseenter", onMouseEnter);
    hero.addEventListener("mouseleave", onMouseLeave);
    hero.addEventListener("touchmove", onTouchMove, { passive: true });
    hero.addEventListener("touchend", onTouchEnd);

    return () => {
      hero.removeEventListener("mousemove", onMouseMove);
      hero.removeEventListener("mouseenter", onMouseEnter);
      hero.removeEventListener("mouseleave", onMouseLeave);
      hero.removeEventListener("touchmove", onTouchMove);
      hero.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  /* ── Custom cursor animation loop & Spotlight reveal ─── */
  useEffect(() => {
    const animateCursor = () => {
      cursorSmooth.current.x += (cursorPos.current.x - cursorSmooth.current.x) * 0.15;
      cursorSmooth.current.y += (cursorPos.current.y - cursorSmooth.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorSmooth.current.x - 7}px, ${cursorSmooth.current.y - 7}px)`;
      }

      // Update real colored portrait spotlight mask
      if (colorPortraitRef.current && layoutRef.current.portraitW > 0) {
        const cx = cursorSmooth.current.x;
        const cy = cursorSmooth.current.y;
        const { portraitW, portraitH, offsetX, offsetY } = layoutRef.current;

        // Check distance to portrait bounding box
        const dx = Math.max(0, offsetX - cx, cx - (offsetX + portraitW));
        const dy = Math.max(0, offsetY - cy, cy - (offsetY + portraitH));
        const dist = Math.sqrt(dx * dx + dy * dy);

        const radius = Math.round(window.innerHeight * CONFIG.CURSOR_RADIUS);
        const isNearPortrait = dist < radius && isMouseInsideRef.current && scrollProgressRef.current < 0.12;

        if (isNearPortrait) {
          const relX = cx - offsetX;
          const relY = cy - offsetY;
          // Smooth circular lens revealing real colored photo under cursor
          const mask = `radial-gradient(circle ${radius}px at ${relX}px ${relY}px, #000 40%, rgba(0,0,0,0.55) 70%, transparent 100%)`;
          colorPortraitRef.current.style.webkitMaskImage = mask;
          colorPortraitRef.current.style.maskImage = mask;
          colorPortraitRef.current.style.webkitMaskRepeat = "no-repeat";
          colorPortraitRef.current.style.maskRepeat = "no-repeat";
          colorPortraitRef.current.style.webkitMaskSize = "100% 100%";
          colorPortraitRef.current.style.maskSize = "100% 100%";
          colorPortraitRef.current.style.opacity = "1";
        } else {
          colorPortraitRef.current.style.opacity = "0";
        }
      }

      cursorRaf.current = requestAnimationFrame(animateCursor);
    };
    cursorRaf.current = requestAnimationFrame(animateCursor);
    return () => {
      if (cursorRaf.current) cancelAnimationFrame(cursorRaf.current);
    };
  }, []);

  /* ── GSAP Text Reveal + Scroll ─────────────────── */
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const validWords = wordRefs.current.filter((w): w is HTMLSpanElement => w !== null);

      if (prefersReducedMotion) {
        gsap.set(validWords, { opacity: 1, y: 0 });
        if (paraRef.current) gsap.set(paraRef.current, { opacity: 1, y: 0 });
        if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 1, y: 0 });
        if (headerRef.current) gsap.set(headerRef.current, { opacity: 1, y: 0 });
        if (globeRef.current) gsap.set(globeRef.current, { opacity: 1, x: 0 });
        if (dockRef.current) gsap.set(dockRef.current, { opacity: 1, y: 0 });
      } else {
        // Immediate smooth text entrance on page load without waiting for WebGL asset parsing
        const introTL = gsap.timeline({ defaults: { ease: "power3.out" } });

        introTL
          .fromTo(
            validWords,
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.75, stagger: 0.03, ease: "power3.out" },
            0.15
          )
          // Paragraph and buttons fade up
          .fromTo(
            paraRef.current,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            0.55
          )
          .fromTo(
            ctaRef.current,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            0.7
          )
          // Header, globe, dock fade in
          .fromTo(
            headerRef.current,
            { y: -10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55 },
            0.85
          )
          .fromTo(
            globeRef.current,
            { x: -15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55 },
            1.0
          )
          .fromTo(
            dockRef.current,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            1.1
          );
      }

      // ── Scroll-driven dissolve ─────────────────
      if (!prefersReducedMotion) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            scrollProgressRef.current = p;
            sceneRef.current?.setScroll(p);
            if (colorPortraitRef.current && p > 0.05) {
              colorPortraitRef.current.style.opacity = "0";
            }

            // Headline on scroll: split into words.
            // Each word moves with a different parallax offset:
            // - first word ("I"): shifts up/right
            // - middle words: move left and down
            // - last words ("your", "business."): travel up and right and linger longest
            const words = wordRefs.current;
            if (words[0]) {
              // Word 0: "I" (shifts up/right)
              gsap.set(words[0], {
                x: p * 55,
                y: -p * 75,
                opacity: Math.max(0, 1 - p * 3.2),
              });
            }
            // Middle words (1 to 7: "build", "software", "and", "automate", "the", "work", "behind")
            for (let i = 1; i <= 7; i++) {
              if (words[i]) {
                const dirX = (i % 2 === 0 ? 1 : 0.8) * -40;
                const dirY = (i % 2 === 0 ? 1 : 1.3) * 50;
                gsap.set(words[i], {
                  x: p * dirX,
                  y: p * dirY,
                  opacity: Math.max(0, 1 - p * 2.8),
                });
              }
            }
            // Last words: "your" (8) and "business." (9) - travel up and right and linger longest
            if (words[8]) {
              gsap.set(words[8], {
                x: p * 60,
                y: -p * 60,
                opacity: Math.max(0, 1 - p * 2.2),
              });
            }
            if (words[9]) {
              gsap.set(words[9], {
                x: p * 80,
                y: -p * 75,
                opacity: Math.max(0, 1 - p * 2.0),
              });
            }

            // Para and buttons fade out first (p < 0.25)
            if (paraRef.current) {
              gsap.set(paraRef.current, { opacity: Math.max(0, 1 - p * 4.0) });
            }
            if (ctaRef.current) {
              gsap.set(ctaRef.current, { opacity: Math.max(0, 1 - p * 4.0) });
            }

            // Header fades out (p < 0.28)
            if (headerRef.current) {
              gsap.set(headerRef.current, {
                y: -p * 20,
                opacity: Math.max(0, 1 - p * 3.5),
              });
            }

            // Globe dims
            if (globeRef.current) {
              gsap.set(globeRef.current, { opacity: Math.max(0, 1 - p * 3.0) });
            }

            // Dock fades
            if (dockRef.current) {
              gsap.set(dockRef.current, {
                y: p * 20,
                opacity: Math.max(0, 1 - p * 3.5),
              });
            }

            // Scroll menu button fades in as distortion progresses (p > 0.50)
            if (scrollMenuRef.current) {
              const menuOpacity = Math.max(0, (p - 0.50) * 3.0);
              gsap.set(scrollMenuRef.current, { opacity: Math.min(1, menuOpacity) });
            }

            // About teaser appears near end of the hero pin (p > 0.82)
            if (aboutRuleRef.current) {
              const aboutOpacity = Math.max(0, (p - 0.82) / 0.14);
              gsap.set(aboutRuleRef.current, { opacity: Math.min(1, aboutOpacity), y: Math.max(0, (1 - p) * 35) });
            }
            if (aboutTextRef.current) {
              const textOpacity = Math.max(0, (p - 0.86) / 0.12);
              gsap.set(aboutTextRef.current, { opacity: Math.min(1, textOpacity), y: Math.max(0, (1 - p) * 45) });
            }
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  /* ── Lenis Smooth Scroll ───────────────────────── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Connect Lenis to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* ── Helpers ───────────────────────────────────── */
  const scrollTo = useCallback((id: string) => {
    const el = document.querySelector(id);
    if (el) {
      lenisRef.current?.scrollTo(el as HTMLElement, { offset: 0 });
    }
  }, []);

  const handleNavClick = useCallback((href: string) => {
    scrollTo(href);
  }, [scrollTo]);

  return (
    <div
      ref={heroRef}
      id="home"
      className="relative w-full cursor-auto md:cursor-none"
      style={{ height: "350vh" }}
    >
      {/* ── Sticky viewport container ───────────────── */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden" style={{ background: "#101010" }}>

        {/* ── Real Colored Portrait (Revealed dynamically under cursor spotlight) ── */}
        <div
          ref={colorPortraitRef}
          className="absolute pointer-events-none select-none z-[12]"
          style={{
            position: "absolute",
            overflow: "hidden",
            opacity: 0,
            willChange: "mask-image, -webkit-mask-image, opacity",
          }}
        >
          <img
            src="/tanmay-cutout.png"
            alt="Tanmay Kumar"
            className="w-full h-full object-contain object-bottom pointer-events-none select-none"
            draggable={false}
          />
        </div>

        {/* ── Three.js Particle Canvas (Renders stipple dots ON TOP of colored image) ── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
          style={{ display: "block" }}
        />

        {/* ── Static fallback if WebGL not available ─── */}
        <noscript>
          <img
            src="/tanmay.jpg"
            alt="Tanmay Kumar"
            className="absolute inset-0 w-full h-full object-contain opacity-60"
          />
        </noscript>

        {/* ── Custom cursor (desktop reticle) ────────── */}
        <div
          ref={cursorRef}
          className="fixed top-0 left-0 pointer-events-none z-50 transition-opacity duration-200 hidden md:flex items-center justify-center"
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: "1.5px solid rgba(255, 255, 255, 0.75)",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(2px)",
            opacity: showCursor ? 1 : 0,
            willChange: "transform",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
        </div>

        {/* ── HEADER ─────────────────────────────────── */}
        <header
          ref={headerRef}
          className="absolute top-0 left-0 right-0 z-30 py-5 px-5 sm:px-8 flex items-center justify-between"
          style={{ opacity: 0 }}
        >
          {/* Left: Name + dots + role */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => handleNavClick("#home")}
              className="text-white text-sm font-bold tracking-tight flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              style={{ cursor: "none" }}
            >
              <span>{portfolioData.personal.name}</span>
              <span className="text-[#5851D5] text-xs font-mono font-bold">••</span>
            </button>

            <div className="hidden md:block w-px h-3.5 bg-white/20" />

            <span className="hidden md:inline-block text-[11px] font-mono text-white/50 tracking-tight">
              Software Engineer · Full-Stack & AI Automation
            </span>
          </div>

          {/* Center: Available badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/5 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open for freelance work</span>
          </div>

          {/* Right: Nav + Menu pill */}
          <div className="flex items-center gap-5 sm:gap-6">
            <nav className="hidden sm:flex items-center gap-5 text-[11px] font-medium text-white/50">
              {["About", "Work", "Pricing", "Writing & Links"].map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    handleNavClick(
                      item === "About"
                        ? "#about"
                        : item === "Work"
                        ? "#projects"
                        : item === "Pricing"
                        ? "#pricing"
                        : "#links"
                    )
                  }
                  className="hover:text-white transition-colors"
                  style={{ cursor: "none" }}
                >
                  {item}
                </button>
              ))}
            </nav>

            <button
              onClick={onMenuOpen}
              className="px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-[11px] font-mono font-semibold text-white/80 flex items-center gap-1.5 transition-all"
              style={{ cursor: "none" }}
            >
              <span>Menu</span>
              <span className="text-[#5851D5] font-bold">••</span>
            </button>
          </div>
        </header>

        {/* ── GLOBE WIDGET (left side) ───────────────── */}
        <div
          ref={globeRef}
          className="absolute left-5 sm:left-8 z-20 hidden lg:block"
          style={{ top: "50%", transform: "translateY(-50%)", opacity: 0 }}
        >
          <div className="p-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <GlobeWidget />
          </div>
        </div>

        {/* ── HEADLINE BLOCK ────────────────────────── */}
        <div
          ref={headlineRef}
          className="absolute z-20 left-5 right-5 top-[15%] sm:top-1/2 sm:-translate-y-1/2 sm:left-auto sm:right-8 md:right-10 lg:right-[8%] xl:right-[12%] max-w-lg lg:max-w-xl"
        >
          {/* Main Headline */}
          <h1
            ref={line1Ref}
            className="font-heading font-light tracking-tight text-white leading-[1.12] flex flex-wrap gap-x-[0.24em] gap-y-[0.08em]"
            style={{
              fontSize: "clamp(26px, 4.2vw, 46px)",
            }}
          >
            {HEADLINE_WORDS.map((word, i) => (
              <span
                key={`${word}-${i}`}
                ref={(el) => { wordRefs.current[i] = el; }}
                className="inline-block text-white will-change-transform"
                style={{ opacity: 0 }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Supporting paragraph */}
          <p
            ref={paraRef}
            className="mt-4 sm:mt-5 text-white/60 dark:text-white/50 leading-relaxed max-w-sm sm:max-w-md text-xs sm:text-sm"
            style={{ opacity: 0 }}
          >
            I help startups and businesses build web applications, backend systems,
            and AI-powered automations that simplify operations and turn ideas into
            working products.
          </p>

          {/* CTA row */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4 sm:gap-5 mt-5 sm:mt-6" style={{ opacity: 0 }}>
            <button
              onClick={() => handleNavClick("#links")}
              className="px-6 sm:px-7 py-2.5 rounded-full text-white text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md shadow-indigo-500/20"
              style={{ backgroundColor: CONFIG.ACCENT_INDIGO, cursor: "none" }}
            >
              Let's talk
            </button>
            <button
              onClick={() => handleNavClick("#projects")}
              className="text-white/70 text-xs sm:text-sm font-medium hover:text-white transition-colors inline-flex items-center gap-1 group"
              style={{ cursor: "none" }}
            >
              <span>See the work</span>
              <span className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform text-xs">↘</span>
            </button>
          </div>
        </div>

        {/* ── BOTTOM DOCK ────────────────────────────── */}
        <div
          ref={dockRef}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20"
          style={{ opacity: 0 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[11px] font-mono text-white/60">
            <span className="font-semibold text-white/40">&lt;/&gt;</span>
            <div className="flex items-center bg-white/5 rounded-full p-0.5 mx-1">
              <button
                onClick={() => handleNavClick("#projects")}
                className="px-3 py-1 rounded-full text-[10px] font-semibold bg-white/10 text-white/80"
                style={{ cursor: "none" }}
              >
                Work
              </button>
              <button
                onClick={() => handleNavClick("#about")}
                className="px-3 py-1 rounded-full text-[10px] font-semibold text-white/40 hover:text-white/60"
                style={{ cursor: "none" }}
              >
                Story
              </button>
            </div>
            <div className="w-px h-3 bg-white/10 mx-0.5" />
            <span className="font-semibold text-white/50">IN · IST</span>
          </div>
        </div>

        {/* ── SCROLL MENU BUTTON (bottom-right, appears on scroll) ─ */}
        <button
          ref={scrollMenuRef}
          onClick={onMenuOpen}
          className="absolute bottom-5 right-5 z-30 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "#544DD1",
            opacity: 0,
            cursor: "none",
          }}
          aria-label="Open menu"
        >
          <div className="w-4 h-[2px] bg-white rounded-full" />
        </button>

        {/* ── ABOUT TEASER (appears at scroll end) ─── */}
        <div
          ref={aboutRuleRef}
          className="absolute bottom-28 left-5 right-5 sm:left-8 sm:right-8 z-20"
          style={{ opacity: 0 }}
        >
          <div className="border-t border-white/10 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] font-mono text-white/50 uppercase tracking-widest">
              <span className="font-bold text-white/70">[01]</span>
              <span className="font-bold text-white/80">ABOUT ME</span>
            </div>
            <span className="text-[11px] font-mono text-white/30">
              India, working worldwide
            </span>
          </div>
        </div>

        <div
          ref={aboutTextRef}
          className="absolute bottom-8 left-5 right-5 sm:left-8 sm:right-8 lg:left-8 lg:right-[30%] z-20"
          style={{ opacity: 0 }}
        >
          <p className="text-white/50 text-sm sm:text-base leading-relaxed">
            Most of what I build, you'll never see:{" "}
            <strong className="text-white/90 font-semibold">
              the APIs that handle traffic, the AI pipelines that eliminate manual work,
            </strong>{" "}
            and the database schemas that keep data in sync.{" "}
            <strong className="text-white/90 font-semibold">
              I engineer frontend too,
            </strong>{" "}
            so the part you do see performs exactly the way it should.
          </p>
        </div>

        {/* ── Circular rotating badge (bottom-right, above menu btn) */}
        <div
          className="absolute bottom-24 right-6 z-20 hidden lg:block"
          style={{ opacity: 0.6 }}
        >
          <svg width="72" height="72" viewBox="0 0 72 72" className="animate-spin-slow">
            <defs>
              <path
                id="heroCirclePath"
                d="M 36,36 m -28,0 a 28,28 0 1,1 56,0 a 28,28 0 1,1 -56,0"
              />
            </defs>
            <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeDasharray="2 3" />
            <text fill="rgba(255,255,255,0.3)" fontSize="6.5" fontFamily="monospace" letterSpacing="2.5" fontWeight="600">
              <textPath href="#heroCirclePath" startOffset="0%">
                ★ SOFTWARE ENGINEER ★ AI AUTOMATION ★
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ParticleHero;
