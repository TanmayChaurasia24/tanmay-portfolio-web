import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Monitor,
  Server,
  Database,
  Smartphone,
  Cpu,
  Cloud,
  Layers,
  Sparkles,
} from "lucide-react";
import portfolioData from "../data/portfolio.json";
import { TechLogo } from "./TechLogo";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Frontend: Monitor,
  Backend: Server,
  Database: Database,
  Mobile: Smartphone,
  "AI & Automation": Cpu,
  "DevOps & Cloud": Cloud,
};

interface SkillBubbleProps {
  skill: string;
  index: number;
}

const SkillBubble: React.FC<SkillBubbleProps> = ({ skill, index }) => {
  // Stagger duration between 3.2s and 4.6s with alternating directions
  const duration = 3.2 + (index % 4) * 0.45;
  const delay = (index * 0.25) % 2.4;
  const isAlt = index % 2 === 1;

  return (
    <div
      style={{
        animation: `${isAlt ? "bubble-float-alt" : "bubble-float"} ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
      className="group relative inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border/80 bg-card/85 dark:bg-card/65 backdrop-blur-md shadow-xs hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20 hover:scale-108 hover:-translate-y-1.5 active:scale-95 transition-all duration-300 cursor-default select-none overflow-hidden"
    >
      {/* Glossy top bubble reflection highlight */}
      <span
        aria-hidden="true"
        className="absolute inset-x-2.5 top-0.5 h-[35%] rounded-full bg-gradient-to-b from-white/25 dark:from-white/10 to-transparent pointer-events-none"
      />

      {/* Bubble tool logo with playful hover tilt/scale */}
      <span className="relative z-10 w-4 h-4 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
        <TechLogo name={skill} size={15} />
      </span>

      {/* Skill name */}
      <span className="relative z-10 text-xs font-medium text-foreground tracking-tight group-hover:text-primary transition-colors">
        {skill}
      </span>
    </div>
  );
};

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const categories = ["All", ...portfolioData.skills.map((s) => s.category)];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      const skillCards = skillsRef.current?.children;
      if (skillCards) {
        gsap.fromTo(
          skillCards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: skillsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const displayedSkills =
    activeFilter === "All"
      ? portfolioData.skills
      : portfolioData.skills.filter((s) => s.category === activeFilter);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-muted/20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Top Section Index Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest pb-8 border-b border-border/50 mb-12 sm:mb-16">
          <div className="flex items-center gap-4">
            <span className="font-bold text-foreground">(05)</span>
            <span>TECH STACK</span>
          </div>
          <span>Frontend, Backend, DevOps & AI</span>
        </div>

        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-10">
          <Badge
            variant="outline"
            className="text-xs font-semibold uppercase tracking-wider mb-3 px-3 py-1 text-primary border-primary/30"
          >
            Tech Stack & Capabilities
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Technical Skills & Technologies
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Tools, languages, frameworks, and automation platforms I work with in production.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer",
                activeFilter === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-xs scale-105"
                  : "bg-card/70 border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Category Cards Grid */}
        <div
          ref={skillsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayedSkills.map((skillGroup) => {
            const Icon = categoryIcons[skillGroup.category] || Layers;

            return (
              <Card
                key={skillGroup.category}
                className="border border-border/70 bg-card hover:border-border/90 hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <CardHeader className="pb-3 border-b border-border/30 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-base font-semibold text-foreground">
                        {skillGroup.category}
                      </CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-mono px-2 py-0.5">
                      {skillGroup.items.length} tools
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 pb-5">
                  <div className="flex flex-wrap gap-2.5">
                    {skillGroup.items.map((skill, idx) => (
                      <SkillBubble key={skill} skill={skill} index={idx} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
