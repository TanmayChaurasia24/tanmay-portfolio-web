import React, { useState, useRef, useEffect, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ServiceCardData {
  id: string;
  num: string;
  title: string;
  headline: string;
  description: string;
  bullets: string[];
  projectType: string;
}

const TABS: ServiceCardData[] = [
  {
    id: "web",
    num: "01",
    title: "Full-Stack Web",
    headline: "Custom Web Apps & Scalable SaaS",
    description:
      "From high-conversion landing pages to full-stack SaaS platforms with custom authentication, databases, and responsive UI. I craft web applications designed to solve real business problems.",
    bullets: [
      "React & Next.js frontend engineering",
      "TypeScript with strict type-safety",
      "Tailwind CSS & shadcn/ui components",
      "Responsive, accessible design on every device",
      "E-commerce & custom storefront integrations",
    ],
    projectType: "Full-Stack Application",
  },
  {
    id: "automation",
    num: "02",
    title: "AI & Automations",
    headline: "Autonomous n8n Workflows & API Pipelines",
    description:
      "Eliminate manual bottlenecks with automated pipelines that connect your forms, CRM, communication channels, and internal tools without human intervention.",
    bullets: [
      "n8n workflow orchestration & self-hosting",
      "Lead qualification & CRM synchronization",
      "Social media & content publishing pipelines",
      "Automated alerts via Slack, Telegram, or Email",
      "Webhook triggers and REST API connectors",
    ],
    projectType: "AI Automation",
  },
  {
    id: "chatbots",
    num: "03",
    title: "AI Chatbots & RAG",
    headline: "Grounded Knowledge Assistants",
    description:
      "Intelligent conversational assistants that index your proprietary documents and knowledge bases, retrieving verified context to answer user queries with zero hallucination.",
    bullets: [
      "Document ingestion & semantic text chunking",
      "Vector database indexing & embeddings",
      "Contextual prompt engineering & synthesis",
      "Web chat embedding & API streaming",
      "Human escalation & fallback routing",
    ],
    projectType: "AI Chatbot / RAG",
  },
  {
    id: "devops",
    num: "04",
    title: "Backend & DevOps",
    headline: "Resilient APIs & Cloud Deployments",
    description:
      "Production-grade backend engineering with scalable databases, containerized Docker deployments, and automated CI/CD pipelines configured for 99.9% uptime.",
    bullets: [
      "REST APIs in Node.js, Express & Golang",
      "PostgreSQL & MongoDB schema architecture",
      "Docker containerization & compose setups",
      "AWS cloud infrastructure & reverse proxies",
      "Automated CI/CD deployment pipelines",
    ],
    projectType: "Backend / API Development",
  },
  {
    id: "process",
    num: "05",
    title: "Process & Delivery",
    headline: "From First Call to Long After Launch",
    description:
      "A transparent four-step engagement: Discovery of your business problem, technical Planning, iterative Development with previews, and production Delivery with documentation.",
    bullets: [
      "01 Discover — What is hurting and what winning looks like",
      "02 Architect — System blueprints before any code",
      "03 Build & Iterate — Continuous updates and previews",
      "04 Launch & Support — Clean deployment and handoff",
    ],
    projectType: "Other",
  },
];

const WhatIDo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const handleDiscuss = (projectType: string) => {
    window.dispatchEvent(
      new CustomEvent("select-project-type", { detail: { projectType } })
    );
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  /* ─── Scroll-Triggered Card Deck Animation ───────── */
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const cards = cardRefs.current.filter((c): c is HTMLDivElement => c !== null);
    if (cards.length === 0 || !containerRef.current) return;

    // Refresh ScrollTrigger so layout positions are calculated accurately
    ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Fallback: show first card statically for reduced-motion users
        gsap.set(cards, { opacity: 0, display: "none" });
        gsap.set(cards[0], { opacity: 1, display: "block" });
        return;
      }

      // Initial state: Card 0 active on screen, others prepared below
      gsap.set(cards[0], { opacity: 1, y: 0, scale: 1, pointerEvents: "auto", zIndex: 30 });
      for (let i = 1; i < cards.length; i++) {
        gsap.set(cards[i], { opacity: 0, y: 60, scale: 0.95, pointerEvents: "none", zIndex: 10 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const step = 1 / (cards.length - 1);
            const activeIdx = Math.min(
              cards.length - 1,
              Math.max(0, Math.round(p / step))
            );
            setActiveTab(activeIdx);
          },
        },
      });

      // Build stepped card transitions
      // 5 cards have 4 transitions with equal dwell times
      const dwellDuration = 0.6;
      const transitionDuration = 0.5;

      for (let i = 0; i < cards.length - 1; i++) {
        // Dwell time: Card i stays centered and stationary for reading
        tl.to({}, { duration: dwellDuration });

        const label = `trans_${i}`;
        tl.addLabel(label);

        // Card i slides up and fades out
        tl.to(
          cards[i],
          {
            opacity: 0,
            y: -45,
            scale: 0.95,
            pointerEvents: "none",
            zIndex: 10,
            duration: transitionDuration,
            ease: "power2.inOut",
          },
          label
        );

        // Card i+1 rises from below into center
        tl.fromTo(
          cards[i + 1],
          { opacity: 0, y: 55, scale: 0.95, pointerEvents: "none", zIndex: 10 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            pointerEvents: "auto",
            zIndex: 30,
            duration: transitionDuration,
            ease: "power2.inOut",
          },
          label
        );
      }

      // Final dwell time for Card 4 (remains fully visible at the end of the section)
      tl.to({}, { duration: dwellDuration });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* ─── Scroll directly to a selected card ─────────── */
  const scrollToCard = useCallback((idx: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const containerTop = rect.top + window.scrollY;
    const scrollDistance = container.offsetHeight - window.innerHeight;

    const targetProgress = idx / (TABS.length - 1);
    const targetScroll = containerTop + targetProgress * scrollDistance;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  }, []);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative w-full bg-background"
      style={{ height: "350vh" }}
    >
      {/* ── Sticky Viewport Container (stays pinned while user scrolls through 350vh) ── */}
      <div className="sticky top-0 left-0 w-full h-screen flex flex-col justify-between py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">

        {/* Section Top Header & Counter */}
        <div className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest pb-4 border-b border-border/50">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="font-bold text-[#4f46e5] text-sm">(02)</span>
            <span className="font-bold text-foreground">WHAT I DO</span>
            <span className="hidden md:inline text-muted-foreground/60">· From prototype to production</span>
          </div>

          {/* Active Card Indicator */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-foreground bg-[#4f46e5]/15 px-3 py-1 rounded-full border border-[#4f46e5]/30">
              {TABS[activeTab].num} / 05
            </span>
            <span className="hidden sm:inline font-semibold text-foreground/90 tracking-tight">
              {TABS[activeTab].title}
            </span>
          </div>
        </div>

        {/* ── Single Card Display Stage (Center of Viewport) ── */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 min-h-[460px] flex items-center justify-center my-2 sm:my-4">
          {TABS.map((tab, idx) => (
            <div
              key={tab.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className="absolute inset-0 m-auto w-full max-h-[85vh] sm:max-h-[80vh] flex items-center justify-center will-change-transform"
              style={{
                opacity: idx === 0 ? 1 : 0,
                pointerEvents: idx === 0 ? "auto" : "none",
                transform: idx === 0 ? "none" : "translateY(60px) scale(0.95)",
              }}
            >
              {/* Elevated Card Surface */}
              <div className="w-full rounded-2xl sm:rounded-3xl border border-border/80 bg-card/95 dark:bg-[#131316]/95 backdrop-blur-xl p-5 sm:p-8 lg:p-10 shadow-2xl overflow-hidden relative">

                {/* Glowing Top Rim Highlight */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6366f1] to-transparent opacity-80" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">

                  {/* Left Column: Text, Bullets, CTA */}
                  <div className="lg:col-span-6 space-y-4 sm:space-y-5">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#4f46e5]/15 text-[#818cf8] border border-[#4f46e5]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8] animate-pulse" />
                      <span>{tab.num} · {tab.title}</span>
                    </div>

                    {/* Headline */}
                    <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-[1.15]">
                      {tab.headline}
                    </h2>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {tab.description}
                    </p>

                    {/* Bullets */}
                    <div className="space-y-2 pt-2 border-t border-border/50">
                      {tab.bullets.map((bullet, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs font-mono text-foreground/85">
                          <span className="text-[#818cf8] font-bold text-sm leading-none mt-0.5">›</span>
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2 sm:pt-3">
                      <Button
                        onClick={() => handleDiscuss(tab.projectType)}
                        className="rounded-full bg-[#4f46e5] hover:bg-[#4338ca] text-white px-6 py-2.5 h-10 text-xs font-semibold gap-2 shadow-lg shadow-[#4f46e5]/25 transition-all hover:scale-105 active:scale-95"
                      >
                        <span>Discuss This Service</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Right Column: Hand-Drawn Chalk Wireframe Illustration */}
                  <div className="lg:col-span-6 flex justify-center items-center">
                    <div className="w-full max-w-[480px] aspect-[16/11] rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center relative overflow-hidden shadow-inner">

                      {/* Tab 0: Full-Stack Web Wireframe */}
                      {idx === 0 && (
                        <svg viewBox="0 0 460 300" className="w-full h-full text-foreground/85 stroke-current">
                          <rect x="15" y="15" width="430" height="270" rx="8" fill="none" strokeWidth="2" strokeDasharray="4 4" />
                          <line x1="15" y1="45" x2="445" y2="45" strokeWidth="1.5" strokeDasharray="3 3" />
                          <circle cx="35" cy="30" r="3" fill="currentColor" />
                          <circle cx="50" cy="30" r="3" fill="currentColor" />
                          <circle cx="65" cy="30" r="3" fill="currentColor" />
                          <rect x="35" y="60" width="390" height="90" fill="none" strokeWidth="1.5" strokeDasharray="4 4" />
                          <line x1="35" y1="60" x2="425" y2="150" strokeWidth="1" strokeDasharray="3 4" />
                          <line x1="425" y1="60" x2="35" y2="150" strokeWidth="1" strokeDasharray="3 4" />
                          <rect x="35" y="165" width="115" height="100" fill="none" strokeWidth="1.5" strokeDasharray="3 3" />
                          <rect x="172" y="165" width="115" height="100" fill="none" strokeWidth="1.5" strokeDasharray="3 3" />
                          <rect x="310" y="165" width="115" height="100" fill="none" strokeWidth="1.5" strokeDasharray="3 3" />
                          <circle cx="230" cy="105" r="14" fill="#4f46e5" opacity="0.85" />
                        </svg>
                      )}

                      {/* Tab 1: AI & Automations Radial Integrations Wheel */}
                      {idx === 1 && (
                        <svg viewBox="0 0 460 300" className="w-full h-full text-foreground/85 font-mono text-[11px]">
                          <circle cx="230" cy="150" r="36" fill="#4f46e5" opacity="0.95" />
                          <text x="230" y="154" textAnchor="middle" fill="white" fontWeight="bold">n8n</text>
                          <line x1="230" y1="150" x2="80" y2="60" stroke="#4f46e5" strokeWidth="2.5" strokeDasharray="3 3" />
                          <line x1="230" y1="150" x2="380" y2="60" stroke="#4f46e5" strokeWidth="2.5" strokeDasharray="3 3" />
                          <line x1="230" y1="150" x2="70" y2="150" stroke="#4f46e5" strokeWidth="2.5" strokeDasharray="3 3" />
                          <line x1="230" y1="150" x2="390" y2="150" stroke="#4f46e5" strokeWidth="2.5" strokeDasharray="3 3" />
                          <line x1="230" y1="150" x2="80" y2="240" stroke="#4f46e5" strokeWidth="2.5" strokeDasharray="3 3" />
                          <line x1="230" y1="150" x2="380" y2="240" stroke="#4f46e5" strokeWidth="2.5" strokeDasharray="3 3" />
                          {[
                            { label: "Webhooks", x: 80, y: 60 },
                            { label: "Slack / Email", x: 380, y: 60 },
                            { label: "CRM Sync", x: 70, y: 150 },
                            { label: "Google Sheets", x: 390, y: 150 },
                            { label: "AI Prompts", x: 80, y: 240 },
                            { label: "Custom APIs", x: 380, y: 240 },
                          ].map((node, nodeIdx) => (
                            <g key={nodeIdx} transform={`translate(${node.x}, ${node.y})`}>
                              <rect
                                x="-48"
                                y="-16"
                                width="96"
                                height="32"
                                rx="16"
                                fill="currentColor"
                                fillOpacity="0.08"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeDasharray="2 3"
                              />
                              <text x="0" y="4" textAnchor="middle" fill="currentColor" fontWeight="bold">
                                {node.label}
                              </text>
                            </g>
                          ))}
                        </svg>
                      )}

                      {/* Tab 2: AI Chatbots & RAG Soundwave */}
                      {idx === 2 && (
                        <svg viewBox="0 0 460 300" className="w-full h-full text-foreground/85 font-mono">
                          {[
                            20, 35, 55, 90, 140, 190, 240, 180, 130, 85, 60, 100, 160, 210, 250, 200, 140, 80, 45, 25,
                          ].map((h, barIdx) => {
                            const x = 35 + barIdx * 20;
                            return (
                              <g key={barIdx}>
                                <line
                                  x1={x}
                                  y1={150 - h / 2}
                                  x2={x}
                                  y2={150 + h / 2}
                                  stroke="#4f46e5"
                                  strokeWidth="3.5"
                                  strokeDasharray="2 3"
                                  strokeLinecap="round"
                                />
                              </g>
                            );
                          })}
                          <circle cx="235" cy="150" r="10" fill="#4f46e5" />
                          <text x="230" y="275" textAnchor="middle" fill="currentColor" fontSize="10" letterSpacing="0.1em">
                            SEMANTIC VECTOR EMBEDDING RETRIEVAL
                          </text>
                        </svg>
                      )}

                      {/* Tab 3: Backend & DevOps Bezier Grid */}
                      {idx === 3 && (
                        <svg viewBox="0 0 460 300" className="w-full h-full text-foreground/85">
                          {Array.from({ length: 9 }).map((_, lineIdx) => (
                            <line
                              key={`v-${lineIdx}`}
                              x1={30 + lineIdx * 50}
                              y1="20"
                              x2={30 + lineIdx * 50}
                              y2="280"
                              stroke="currentColor"
                              strokeWidth="1"
                              strokeDasharray="2 4"
                              opacity="0.3"
                            />
                          ))}
                          {Array.from({ length: 6 }).map((_, lineIdx) => (
                            <line
                              key={`h-${lineIdx}`}
                              x1="20"
                              y1={30 + lineIdx * 50}
                              x2="440"
                              y2={30 + lineIdx * 50}
                              stroke="currentColor"
                              strokeWidth="1"
                              strokeDasharray="2 4"
                              opacity="0.3"
                            />
                          ))}
                          <path d="M 40,240 C 130,20 280,280 420,50" fill="none" stroke="#4f46e5" strokeWidth="3.5" />
                          <rect x="34" y="234" width="12" height="12" fill="#4f46e5" />
                          <circle cx="130" cy="20" r="6" fill="currentColor" />
                          <line x1="40" y1="240" x2="130" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                          <circle cx="280" cy="280" r="6" fill="currentColor" />
                          <rect x="414" y="44" width="12" height="12" fill="#4f46e5" />
                          <line x1="420" y1="50" x2="280" y2="280" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                        </svg>
                      )}

                      {/* Tab 4: Process & Architecture Stepper Pipeline */}
                      {idx === 4 && (
                        <svg viewBox="0 0 460 300" className="w-full h-full text-foreground/85 font-mono text-[11px]">
                          {[
                            { label: "01 Discover", desc: "Requirements", y: 55 },
                            { label: "02 Architect", desc: "Blueprints", y: 115 },
                            { label: "03 Build", desc: "Clean Code", y: 175 },
                            { label: "04 Deploy", desc: "Production", y: 235 },
                          ].map((step, stepIdx) => (
                            <g key={stepIdx}>
                              <line x1="50" y1="40" x2="50" y2="250" stroke="#4f46e5" strokeWidth="2" strokeDasharray="3 3" />
                              <circle cx="50" cy={step.y} r="8" fill="#4f46e5" />
                              <text x="80" y={step.y - 2} fill="currentColor" fontWeight="bold">
                                {step.label}
                              </text>
                              <text x="80" y={step.y + 14} fill="currentColor" fillOpacity="0.6" fontSize="10">
                                {step.desc}
                              </text>
                            </g>
                          ))}
                          <rect x="240" y="45" width="190" height="200" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                          <text x="335" y="150" textAnchor="middle" fill="#4f46e5" fontWeight="bold">
                            PRODUCTION
                          </text>
                          <text x="335" y="168" textAnchor="middle" fill="currentColor" fontSize="10">
                            READY FOR LAUNCH
                          </text>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom Interactive Tab Pills (Clickable navigation) ── */}
        <div className="relative z-10 max-w-6xl w-full mx-auto pt-3 border-t border-border/50">
          <div className="grid grid-cols-5 gap-2 sm:gap-3 font-mono">
            {TABS.map((tab, idx) => {
              const isSelected = activeTab === idx;
              return (
                <button
                  key={tab.id}
                  onClick={() => scrollToCard(idx)}
                  className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all ${isSelected
                    ? "border-[#6366f1] bg-[#4f46e5]/15 text-foreground shadow-md ring-1 ring-[#818cf8]/40"
                    : "border-border/50 hover:border-border text-muted-foreground/70 hover:text-foreground hover:bg-muted/40"
                    }`}
                  aria-label={`Jump to ${tab.title}`}
                >
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground/80 mb-0.5 flex items-center justify-between">
                    <span className={isSelected ? "font-bold text-[#818cf8]" : ""}>{tab.num}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8] animate-pulse" />
                    )}
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold leading-tight line-clamp-1">
                    {tab.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhatIDo;
