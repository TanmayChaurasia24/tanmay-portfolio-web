import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CircularStamp from "./CircularStamp";
import portfolioData from "../data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        stampRef.current,
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: stampRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-muted/20 relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Section Index Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest pb-8 border-b border-border/50 mb-12 sm:mb-16">
          <div className="flex items-center gap-4">
            <span className="font-bold text-foreground">(01)</span>
            <span>ABOUT ME</span>
          </div>
          <span>India, working worldwide</span>
        </div>

        {/* Editorial Statement + Circular Rotating Stamp */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center mb-16 sm:mb-24">
          <div ref={textRef} className="lg:col-span-8">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground leading-[1.25]">
              Most of what I build, you'll never see:{" "}
              <strong className="font-extrabold text-foreground">
                the APIs that handle high-volume traffic, the autonomous AI pipelines that eliminate manual work,
              </strong>{" "}
              and the database schemas that keep data in sync.{" "}
              <strong className="font-extrabold text-foreground">
                I engineer frontend too,
              </strong>{" "}
              so the part you do see looks and performs exactly the way it should.
            </h2>
          </div>

          <div
            ref={stampRef}
            className="lg:col-span-4 flex justify-center lg:justify-end"
          >
            <CircularStamp text="★ SOFTWARE ENGINEER ★ FULL-STACK & AI AUTOMATION ★ 2026 ★" />
          </div>
        </div>

        {/* Bottom Metrics with Dotted / Stippled Typography */}
        <div
          ref={metricsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pt-10 border-t border-border/50 font-mono"
        >
          <div className="border-l-2 border-primary/40 pl-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-heading">
              12+
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Production web & mobile apps
            </div>
          </div>

          <div className="border-l-2 border-emerald-500/40 pl-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-heading">
              4+
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Autonomous n8n & RAG workflows
            </div>
          </div>

          <div className="border-l-2 border-indigo-500/40 pl-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-heading">
              B.Tech
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Computer Science (2022–2026)
            </div>
          </div>

          <div className="border-l-2 border-cyan-500/40 pl-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-heading">
              100%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Code quality & reliability focus
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
