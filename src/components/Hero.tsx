
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download } from 'lucide-react';
import SocialLinks from './SocialLinks';
import portfolioData from '../data/portfolio.json';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Skip animations for users who prefer reduced motion
      gsap.set([titleRef.current, subtitleRef.current, buttonsRef.current], {
        opacity: 1,
        y: 0
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Initial animations with better performance
      gsap.set([titleRef.current, subtitleRef.current, buttonsRef.current], {
        opacity: 0,
        y: 30
      });

      const tl = gsap.timeline();
      
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      })
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")
      .to(buttonsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.2");

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
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Simplified background gradient */}
      <div className="absolute inset-0 solana-gradient opacity-20 dark:opacity-10"></div>
      
      {/* Optimized animated background pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-500/10 to-red-500/10 dark:from-purple-400/5 dark:via-pink-500/5 dark:to-red-500/5"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold mb-6 solana-gradient-text"
        >
          {portfolioData.personal.name}
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          {portfolioData.personal.title} • {portfolioData.personal.subtitle}
        </p>

        <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
          {portfolioData.personal.bio}
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            onClick={scrollToProjects}
            className="solana-gradient text-white px-8 py-3 text-lg hover:opacity-90 transition-opacity"
          >
            View My Work
          </Button>
          
          <Button 
            variant="outline" 
            className="px-8 py-3 text-lg border-2 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Resume
          </Button>
        </div>

        <SocialLinks />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
