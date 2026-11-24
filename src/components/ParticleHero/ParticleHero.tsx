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

const LINE1_WORDS = ["I", "build", "software", "and", "automate"];
const LINE2_WORDS = ["the", "work", "behind", "your", "business."];

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
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
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
  const cursorPos = useRef({ x: -100, y: -100 });
  const cursorSmooth = useRef({ x: -100, y: -100 });
  const cursorRaf = useRef<number | null>(null);

  /* ── WebGL Scene Setup ────────────────────────────── */
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new ParticleScene({
      canvas: canvasRef.current,
      imageSrc: "/tanmay-cutout.png",
      onReady: () => setSceneReady(true),
    });
    scene.initCamera();
    sceneRef.current = scene;

    const handleResize = () => scene.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  /* ── Cursor Tracking (canvas + custom dot) ─────── */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      sceneRef.current?.setMouse(x, y);
      cursorPos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseEnter = () => setShowCursor(true);
    const onMouseLeave = () => {
      setShowCursor(false);
      sceneRef.current?.clearMouse();
    };

    // Touch support
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const rect = hero.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      sceneRef.current?.setMouse(x, y);
    };
    const onTouchEnd = () => {
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

  /* ── Custom cursor animation loop ─────────────── */
  useEffect(() => {
    const animateCursor = () => {
      cursorSmooth.current.x += (cursorPos.current.x - cursorSmooth.current.x) * 0.15;
      cursorSmooth.current.y += (cursorPos.current.y - cursorSmooth.current.y) * 0.15;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorSmooth.current.x - 5}px, ${cursorSmooth.current.y - 5}px)`;
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
    if (!sceneReady) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // ── Intro timeline ─────────────────────────
      const introTL = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (!prefersReducedMotion) {
        // t≈0.5-1.0s: The headline words reveal by rising from below a mask (translateY 100%→0, clipped line reveal, stagger 0.04s, ease power3.out)
        const validWords = wordRefs.current.filter((w): w is HTMLSpanElement => w !== null);
        introTL
          .fromTo(
            validWords,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.04, ease: "power3.out" },
            0.5
          )
          // Paragraph and buttons fade up
          .fromTo(
            paraRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7 },
            1.0
          )
          .fromTo(
            ctaRef.current,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            1.1
          )
          // Header, globe, dock fade in around t≈1.5
          .fromTo(
            headerRef.current,
            { y: -15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            1.3
          )
          .fromTo(
            globeRef.current,
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.6 },
            1.5
          )
          .fromTo(
            dockRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            1.7
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
            sceneRef.current?.setScroll(p);

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
  }, [sceneReady]);

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
      className="relative w-full"
      style={{ height: "350vh", cursor: "none" }}
    >
      {/* ── Sticky viewport container ───────────────── */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden" style={{ background: "#101010" }}>

        {/* ── Three.js Canvas ────────────────────────── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
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

        {/* ── Custom cursor ──────────────────────────── */}
        <div
          ref={cursorRef}
          className="fixed top-0 left-0 pointer-events-none z-50 transition-opacity duration-200"
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "#fff",
            mixBlendMode: "difference",
            opacity: showCursor ? 1 : 0,
            willChange: "transform",
          }}
        />

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
              {["About", "Work", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(
                    item === "About" ? "#about" : item === "Work" ? "#projects" : "#contact"
                  )}
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

        {/* ── HEADLINE BLOCK (right side) ────────────── */}
        <div
          ref={headlineRef}
          className="absolute z-20 right-6 sm:right-10 lg:right-[12%] bottom-[15%] sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 max-w-md lg:max-w-lg"
        >
          {/* Line 1 */}
          <div ref={line1Ref} className="overflow-hidden flex flex-wrap gap-x-[0.28em]">
            {LINE1_WORDS.map((word, i) => (
              <span
                key={word}
                ref={(el) => { wordRefs.current[i] = el; }}
                className="inline-block text-white font-light tracking-tight leading-[1.1] will-change-transform"
                style={{
                  fontSize: "clamp(28px, 3.6vw, 44px)",
                  fontFamily: "'Inter', 'Instrument Sans', sans-serif",
                  opacity: 0,
                  transform: "translateY(110%)",
                }}
              >
                {word}
              </span>
            ))}
          </div>
          {/* Line 2 */}
          <div ref={line2Ref} className="overflow-hidden mt-1 flex flex-wrap gap-x-[0.28em]">
            {LINE2_WORDS.map((word, i) => (
              <span
                key={word}
                ref={(el) => { wordRefs.current[LINE1_WORDS.length + i] = el; }}
                className="inline-block text-white font-light tracking-tight leading-[1.1] will-change-transform"
                style={{
                  fontSize: "clamp(28px, 3.6vw, 44px)",
                  fontFamily: "'Inter', 'Instrument Sans', sans-serif",
                  opacity: 0,
                  transform: "translateY(110%)",
                }}
              >
                {word}
              </span>
            ))}
          </div>

          {/* Supporting paragraph */}
          <p
            ref={paraRef}
            className="mt-5 text-white/40 leading-relaxed max-w-sm"
            style={{ fontSize: "13px", opacity: 0 }}
          >
            I help startups and businesses build web applications, backend systems,
            and AI-powered automations that simplify operations and turn ideas into
            working products.
          </p>

          {/* CTA row */}
          <div ref={ctaRef} className="flex items-center gap-5 mt-6" style={{ opacity: 0 }}>
            <button
              onClick={() => handleNavClick("#contact")}
              className="px-7 py-2.5 rounded-full text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: CONFIG.ACCENT_INDIGO, cursor: "none" }}
            >
              Let's talk
            </button>
            <button
              onClick={() => handleNavClick("#projects")}
              className="text-white/60 text-sm font-medium hover:text-white transition-colors inline-flex items-center gap-1 group"
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
