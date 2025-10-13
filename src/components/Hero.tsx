import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download } from "lucide-react";
import SocialLinks from "./SocialLinks";
import portfolioData from "../data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Skip animations for users who prefer reduced motion
      gsap.set([titleRef.current, subtitleRef.current, buttonsRef.current], {
        opacity: 1,
        y: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Initial animations with better performance
      gsap.set([titleRef.current, subtitleRef.current, buttonsRef.current], {
        opacity: 0,
        y: 30,
      });

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
        );

      // Optimized scroll-triggered animation
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

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
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
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="mb-6 inline-block">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider px-4 py-2 bg-primary/10 rounded-full">
            Freelance • Mobile & Web
          </span>
        </div>
        
        <h1
          ref={titleRef}
          className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 solana-gradient-text leading-tight"
        >
          I build fast, beautiful apps.
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-6 font-medium"
        >
          Mobile & Web development for startups and brands — design, frontend, backend, and launch.
        </p>

        <p className="text-base sm:text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          I turn ideas into polished products: smooth animations, clean code, reliable backends, and on-time delivery. From MVPs to production apps, I handle the stack so you can focus on the business.
        </p>

        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button
            onClick={scrollToProjects}
            size="lg"
            className="professional-gradient text-white px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            View Work
          </Button>

          <a href="#contact">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-base font-semibold border-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:-translate-y-1"
            >
              Let’s Build Your App
            </Button>
          </a>
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
