import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParticleHero from "../components/ParticleHero";
import NavBar from "../components/NavBar";
import About from "../components/About";
import PortfolioShowcase from "../components/PortfolioShowcase";
import AIAutomation from "../components/AIAutomation";
import Services from "../components/Services";
import Skills from "../components/Skills";
import FreelanceClients from "../components/FreelanceClients";
import Pricing from "../components/Pricing";
import ArticlesAndLinks from "../components/ArticlesAndLinks";
import Footer from "../components/Footer";
import FloatingDock from "../components/FloatingDock";

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="min-h-screen relative bg-background text-foreground selection:bg-[#4f46e5]/20 selection:text-[#4f46e5]">
      {/* Hidden NavBar — only used for the Sheet menu drawer */}
      <NavBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Particle Portrait Hero (200vh — includes scroll dissolve) */}
      <ParticleHero onMenuOpen={() => setMenuOpen(true)} />

      {/* Section 01: About Me with Rotating Circular Stamp */}
      <About />

      {/* Section 02: What I Do (Full-Stack, AI Automations, RAG, DevOps wireframes) */}
      <Services />

      {/* Section 03: Featured Projects */}
      <PortfolioShowcase />

      {/* Section 04: AI & Workflow Automation Showcase */}
      <AIAutomation />

      {/* Section 05: Tech Stack & Skills */}
      <Skills />

      {/* Section 06: Verified Client Reviews */}
      <FreelanceClients />

      {/* Section 07: Pricing & Custom Scope ("Let's Discuss on a Call") */}
      <Pricing />

      {/* Section 08: Technical Writing, Dev.to Articles & All Verified Links */}
      <ArticlesAndLinks />

      {/* Minimal Editorial Footer */}
      <Footer />

      {/* Floating Bottom Center Dock & Floating Menu Toggle (for below-hero sections) */}
      <FloatingDock onOpenMenu={() => setMenuOpen(true)} />
    </div>
  );
};

export default Index;
