import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import PortfolioShowcase from '../components/PortfolioShowcase';
import Services from '../components/Services';
import Skills from '../components/Skills';
import FreelanceClients from '../components/FreelanceClients';
import Pricing from '../components/Pricing';
import HowItWorks from '../components/HowItWorks';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import BackgroundFX from "../components/BackgroundFX";
import CustomCursor from "../components/CustomCursor";

const Index = () => {
  // Initialize GSAP plugins with performance optimizations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Configure ScrollTrigger for better performance
    ScrollTrigger.config({
      limitCallbacks: true,
      syncInterval: 150,
    });
    
    // Reduce motion for users who prefer it
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      // Only add parallax effects on desktop and if user doesn't prefer reduced motion
      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": function() {
          // Simplified parallax effect with better performance
          const sections = document.querySelectorAll('section');
          sections.forEach((section) => {
            const background = section.querySelector('.background');
            if (background) {
              gsap.to(background, {
                y: '20%',
                ease: 'none',
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1,
                  invalidateOnRefresh: true
                }
              });
            }
          });
        }
      });
    }
    
    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div id="home" className="min-h-screen relative">
      <NavBar />

      {/* Global background and cursor effects */}
      <BackgroundFX />
      <CustomCursor />

      {/* Hero Section */}
      <Hero />

      {/* Portfolio Showcase */}
      <PortfolioShowcase />

      {/* Services Section */}
      <Services />
      
      {/* Skills Section */}
      <Skills />

      {/* Testimonials Section */}
      <FreelanceClients />

      {/* Pricing Section */}
      <Pricing />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
