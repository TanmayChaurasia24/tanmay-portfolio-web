import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { ChevronDown, Calendar } from "lucide-react";
import SocialLinks from "./SocialLinks";
import portfolioData from "../data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const { tagline, heading, subtitle, description, ctaPrimary, ctaSecondary, stats } = portfolioData.hero;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(
        [titleRef.current, subtitleRef.current, buttonsRef.current, statsRef.current],
        { opacity: 1, y: 0 }
      );
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(
        [titleRef.current, subtitleRef.current, buttonsRef.current, statsRef.current],
        { opacity: 0, y: 30 }
      );

      const tl = gsap.timeline();

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          buttonsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.2"
        )
        .to(
          statsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.2"
        );

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (heroRef.current) {
            heroRef.current.style.transform = `translateY(${-30 * progress}%)`;
          }
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToPortfolio = () => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4 sm:px-6"
    >
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>

      {/* Animated elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <div className="mb-5 inline-block">
          <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider px-4 py-2 bg-primary/10 rounded-full">
            {tagline}
          </span>
        </div>

        <h1
          ref={titleRef}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-5 solana-gradient-text leading-[1.1]"
        >
          {heading}
        </h1>

        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-5 font-medium"
        >
          {subtitle}
        </p>

        <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>

        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Button
            onClick={scrollToPortfolio}
            size="lg"
            className="professional-gradient text-white px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {ctaPrimary}
          </Button>

          <a href={portfolioData.personal.calendarUrl} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-base font-semibold border-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
            >
              <Calendar className="h-5 w-5 text-primary" />
              {ctaSecondary}
            </Button>
          </a>
        </div>

        {/* Stats bar */}
        <div
          ref={statsRef}
          className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-12"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold solana-gradient-text">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <SocialLinks />

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
