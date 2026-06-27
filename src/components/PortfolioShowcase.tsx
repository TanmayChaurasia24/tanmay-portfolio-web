import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ChevronLeft, ChevronRight, Monitor, Smartphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import portfolioData from "../data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

type ShowcaseProject = {
  id: string;
  name: string;
  description: string;
  caseStudy?: {
    problem: string;
    solution: string;
    outcome: string;
  };
  technologies: string[];
  screenshots: string[];
  live: string;
};

const ProjectImageCarousel = ({ screenshots, name }: { screenshots: string[]; name: string }) => {
  const [current, setCurrent] = useState(0);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c === 0 ? screenshots.length - 1 : c - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c === screenshots.length - 1 ? 0 : c + 1));
  };

  return (
    <div className="relative group/carousel">
      <div className="aspect-[16/10] bg-muted rounded-t-xl overflow-hidden">
        <img
          src={screenshots[current]}
          alt={`${name} screenshot ${current + 1}`}
          className="w-full h-full object-cover object-top transition-all duration-500 group-hover/carousel:scale-[1.02]"
          loading="lazy"
        />
        {/* Subtle gradient overlay at bottom for dots visibility */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {screenshots.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 hover:bg-background hover:scale-110"
            aria-label="Previous screenshot"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 hover:bg-background hover:scale-110"
            aria-label="Next screenshot"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {screenshots.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-white w-5 shadow-md"
                    : "bg-white/50 w-1.5 hover:bg-white/80"
                }`}
                aria-label={`Go to screenshot ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const MobileImageCarousel = ({ screenshots, name }: { screenshots: string[]; name: string }) => {
  const [current, setCurrent] = useState(0);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c === 0 ? screenshots.length - 1 : c - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c === screenshots.length - 1 ? 0 : c + 1));
  };

  return (
    <div className="relative group/carousel flex justify-center py-8">
      {/* Phone frame */}
      <div className="relative">
        <div className="w-[200px] h-[420px] rounded-[2.5rem] border-[6px] border-foreground/15 bg-black overflow-hidden shadow-2xl shadow-primary/10 ring-1 ring-foreground/5">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-20" />
          <img
            src={screenshots[current]}
            alt={`${name} screen ${current + 1}`}
            className="w-full h-full object-cover transition-all duration-500"
            loading="lazy"
          />
        </div>
      </div>

      {screenshots.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 hover:bg-background hover:scale-110"
            aria-label="Previous screen"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 hover:bg-background hover:scale-110"
            aria-label="Next screen"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {screenshots.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-primary w-5 shadow-md"
                    : "bg-primary/30 w-1.5 hover:bg-primary/60"
                }`}
                aria-label={`Go to screen ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ProjectCard = ({ project, isMobile = false }: { project: ShowcaseProject; isMobile?: boolean }) => (
  <Card className="group glass-card h-full flex flex-col overflow-hidden">
    {isMobile ? (
      <MobileImageCarousel screenshots={project.screenshots} name={project.name} />
    ) : (
      <ProjectImageCarousel screenshots={project.screenshots} name={project.name} />
    )}
    <div className="p-5 sm:p-6 flex flex-col flex-grow">
      <CardTitle className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
        {project.name}
      </CardTitle>

      {project.caseStudy ? (
        <div className="space-y-3 mb-6 flex-grow text-[13px] leading-relaxed">
          <div className="bg-muted/40 p-3 rounded-lg border border-border/40">
            <span className="font-bold text-foreground block mb-1 text-xs uppercase tracking-wider text-red-500/90">The Problem</span>
            <span className="text-muted-foreground">{project.caseStudy.problem}</span>
          </div>
          <div className="bg-muted/40 p-3 rounded-lg border border-border/40">
            <span className="font-bold text-foreground block mb-1 text-xs uppercase tracking-wider text-blue-500/90">What I Did</span>
            <span className="text-muted-foreground">{project.caseStudy.solution}</span>
          </div>
          <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
            <span className="font-bold text-primary block mb-1 text-xs uppercase tracking-wider">The Outcome</span>
            <span className="text-foreground/90 font-medium">{project.caseStudy.outcome}</span>
          </div>
        </div>
      ) : (
        <CardDescription className="text-muted-foreground mb-6 flex-grow text-sm leading-relaxed">
          {project.description}
        </CardDescription>
      )}

      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.technologies.map((tech, index) => (
          <Badge key={index} variant="secondary" className="text-[11px] font-medium px-2 py-0.5">
            {tech}
          </Badge>
        ))}
      </div>

      <div className="mt-auto">
        {project.live && project.live.length > 0 ? (
          <Button
            size="sm"
            className="w-full professional-gradient text-white font-medium h-10"
            asChild
          >
            <a href={project.live} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              View Live
            </a>
          </Button>
        ) : (
          <div className="h-10" /> 
        )}
      </div>
    </div>
  </Card>
);

const PortfolioShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const { webApps, mobileApps } = portfolioData.portfolioShowcase;

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="portfolio" ref={sectionRef} className="py-20 sm:py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            My Work & Case Studies
          </span>
          <h2
            ref={titleRef}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-3 mb-4 solana-gradient-text"
          >
            Portfolio Showcase
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Real projects I've designed and built — showcasing the problem, solution, and business outcome.
          </p>
        </div>

        <Tabs defaultValue="web" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="bg-muted/50 p-1.5 rounded-xl h-auto">
              <TabsTrigger
                value="web"
                className="px-5 sm:px-6 py-2.5 text-sm font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2"
              >
                <Monitor className="h-4 w-4" />
                Web Apps
                <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 h-5">{webApps.length}</Badge>
              </TabsTrigger>
              <TabsTrigger
                value="mobile"
                className="px-5 sm:px-6 py-2.5 text-sm font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2"
              >
                <Smartphone className="h-4 w-4" />
                Mobile Apps
                <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 h-5">{mobileApps.length}</Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="web">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {webApps.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mobile">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {mobileApps.map((project) => (
                <ProjectCard key={project.id} project={project} isMobile />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default PortfolioShowcase;
