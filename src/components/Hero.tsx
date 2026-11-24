import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StipplePortrait from "./StipplePortrait";
import GlobeWidget from "./GlobeWidget";
import portfolioData from "../data/portfolio.json";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        centerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.9 }
      )
        .fromTo(
          leftRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6 },
          "-=0.5"
        )
        .fromTo(
          rightRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          {/* Left Column: Globe & Timezone Widget */}
          <div
            ref={leftRef}
            className="lg:col-span-3 order-2 lg:order-1 flex flex-col justify-center items-start space-y-6"
          >
            <div className="p-3 rounded-2xl border border-border/50 bg-background/40 backdrop-blur-md">
              <GlobeWidget />
            </div>

            <div className="hidden lg:block text-xs text-muted-foreground/80 space-y-1 font-mono max-w-[200px]">
              <p>Specializing in full-stack architecture, n8n automations & RAG agents.</p>
            </div>
          </div>

          {/* Center Column: The Interactive Stipple Halftone Portrait */}
          <div
            ref={centerRef}
            className="lg:col-span-5 order-1 lg:order-2 flex justify-center items-center"
          >
            <StipplePortrait
              imageSrc="/tanmay.jpg"
              className="w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[420px]"
            />
          </div>

          {/* Right Column: Editorial Typography & Actions */}
          <div
            ref={rightRef}
            className="lg:col-span-4 order-3 lg:order-3 text-left space-y-6"
          >
            {/* Diagonal Arrow Icon */}
            <div className="w-8 h-8 rounded-full border border-border/70 flex items-center justify-center text-foreground/80">
              <ArrowDownRight className="h-4 w-4" />
            </div>

            {/* Massive Editorial Headline */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.12]">
              Software & automations you never have to worry about.
            </h1>

            {/* Supporting Copy */}
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              I build fast, custom web applications, SaaS platforms, and AI-powered automations — from the responsive storefront and UI to the integrations, APIs, and databases behind it.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                onClick={() => scrollTo("#contact")}
                className="rounded-full bg-[#4f46e5] hover:bg-[#4338ca] text-white px-7 py-2.5 h-11 text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <span>Let's talk</span>
              </Button>

              <button
                onClick={() => scrollTo("#projects")}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground/85 hover:text-primary transition-colors group"
              >
                <span>See the work</span>
                <span className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
                  ↘
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
