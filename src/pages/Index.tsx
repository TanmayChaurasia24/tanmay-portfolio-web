
import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Index = () => {
  // Initialize GSAP plugins
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Smooth scroll setup
    gsap.to('body', { 
      duration: 0.3, 
      scrollBehavior: 'smooth',
      ease: 'power2.inOut'
    });
    
    // Scroll trigger for parallax effects
    ScrollTrigger.matchMedia({
      "(min-width: 768px)": function() {
        // Parallax effect for large screens
        const sections = document.querySelectorAll('section');
        sections.forEach((section) => {
          const background = section.querySelector('.background');
          if (background) {
            gsap.to(background, {
              y: '30%',
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            });
          }
        });
      }
    });
    
    return () => {
      // Clean up ScrollTrigger instances to prevent memory leaks
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
      
      {/* Experience Section */}
      <Experience />
      
      {/* Contact Section */}
      <Contact />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
