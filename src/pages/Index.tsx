
import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Hackathons from '../components/Hackathons';
import FreelanceClients from '../components/FreelanceClients';
import Achievements from '../components/Achievements';
import Experience from '../components/Experience';
import Contact from '../components/Contact';

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
    <div id="home" className="min-h-screen">
      <NavBar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Projects Section */}
      <Projects />
      
      {/* Skills Section */}
      <Skills />
      
      {/* Hackathons Section */}
      <Hackathons />
      
      {/* Freelance Clients Section */}
      <FreelanceClients />
      
      {/* Achievements Section */}
      <Achievements />
      
      {/* Experience Section */}
      {/* <Experience /> */}
      
      {/* Contact Section */}
      <Contact />
    </div>
  );
};

export default Index;
