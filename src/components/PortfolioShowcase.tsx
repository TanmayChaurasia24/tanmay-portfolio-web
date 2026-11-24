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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import portfolioData from "../data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

export type ShowcaseProject = {
  id: string;
  name: string;
  category?: string;
  description: string;
  caseStudy?: {
    problem: string;
    solution: string;
    outcome: string;
  };
  technologies: string[];
  screenshots: string[];
  live?: string;
  github?: string;
};

const ProjectCarousel = ({ screenshots, name }: { screenshots: string[]; name: string }) => {
  const [current, setCurrent] = useState(0);

  if (!screenshots || screenshots.length === 0) {
    return (
      <div className="aspect-[16/10] bg-muted/50 rounded-t-xl flex items-center justify-center text-muted-foreground text-xs">
        No preview available
      </div>
    );
  }

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c === 0 ? screenshots.length - 1 : c - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c === screenshots.length - 1 ? 0 : c + 1));
  };

  return (
    <div className="relative group/carousel overflow-hidden rounded-t-xl">
      <div className="aspect-[16/10] bg-muted overflow-hidden relative">
        <img
          src={screenshots[current]}
          alt={`${name} screenshot ${current + 1}`}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/carousel:scale-[1.02]"
          loading="lazy"
          onError={(e) => {
            // Graceful fallback for broken image
            (e.target as HTMLElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none opacity-40 group-hover/carousel:opacity-70 transition-opacity" />
      </div>

      {screenshots.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/60 shadow-md opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-background"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-3.5 w-3.5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/60 shadow-md opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-background"
            aria-label="Next image"
          >
            <ChevronRight className="h-3.5 w-3.5 text-foreground" />
          </button>

          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {screenshots.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(i);
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === current ? "bg-white w-4" : "bg-white/40 w-1 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const PortfolioShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<ShowcaseProject | null>(null);

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

  const webProjects: ShowcaseProject[] = portfolioData.portfolioShowcase.webApps || [];
  const mobileProjects: ShowcaseProject[] = portfolioData.portfolioShowcase.mobileApps || [];
  const allProjects: ShowcaseProject[] = [...webProjects, ...mobileProjects];

  const categories = ["All", "Web Applications", "Mobile Applications", "Backend & APIs"];

  const filteredProjects = allProjects.filter((project) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Web Applications") {
      return webProjects.some((p) => p.id === project.id);
    }
    if (activeCategory === "Mobile Applications") {
      return mobileProjects.some((p) => p.id === project.id);
    }
    if (activeCategory === "Backend & APIs") {
      // Projects that heavily involve backend services, databases, or API infrastructure
      const backendTechs = ["Node.js", "Express", "Prisma", "PostgreSQL", "MongoDB", "Supabase"];
      return project.technologies.some((tech) => backendTechs.includes(tech));
    }
    return true;
  });

  return (
    <section id="projects" ref={sectionRef} className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/40">
      <div className="max-w-7xl mx-auto">
        {/* Top Section Index Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest pb-8 border-b border-border/50 mb-12 sm:mb-16">
          <div className="flex items-center gap-4">
            <span className="font-bold text-foreground">(03)</span>
            <span>FEATURED WORK</span>
          </div>
          <span>Production Web & Mobile Applications</span>
        </div>

        {/* Header */}
        <div ref={titleRef} className="text-center mb-12">
          <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider mb-3 px-3 py-1">
            Engineered Work
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Featured Projects & Applications
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Production web platforms, mobile applications, and backend systems built with modern engineering standards.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="text-xs sm:text-sm font-medium h-9 rounded-lg transition-all"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredProjects.map((project) => {
            const isMobile = mobileProjects.some((p) => p.id === project.id);
            const isBackend = project.technologies.some((tech) =>
              ["Node.js", "Express", "Prisma", "PostgreSQL", "MongoDB"].includes(tech)
            );

            return (
              <Card
                key={project.id}
                className="group border border-border/70 bg-card hover:border-border hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden rounded-xl"
              >
                <div>
                  <ProjectCarousel screenshots={project.screenshots} name={project.name} />

                  <CardContent className="p-5 sm:p-6">
                    {/* Category Label */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <Badge variant="secondary" className="text-[11px] font-medium px-2 py-0.5">
                        {isMobile ? "Mobile App" : isBackend ? "Full-Stack Web" : "Web App"}
                      </Badge>
                      {project.live && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Live In Production
                        </span>
                      )}
                    </div>

                    <CardTitle className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>

                    <CardDescription className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                      {project.description}
                    </CardDescription>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border/40"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </div>

                {/* Footer Buttons */}
                <div className="p-5 sm:p-6 pt-0 border-t border-border/30 mt-auto flex items-center gap-2">
                  {project.caseStudy && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCaseStudy(project)}
                      className="text-xs font-semibold flex-1 h-9 gap-1.5"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Case Study</span>
                    </Button>
                  )}

                  {project.live && (
                    <Button
                      size="sm"
                      asChild
                      className="text-xs font-semibold flex-1 h-9 gap-1.5"
                    >
                      <a href={project.live} target="_blank" rel="noopener noreferrer">
                        <span>Live Demo</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Case Study Modal Dialog */}
        <Dialog open={!!selectedCaseStudy} onOpenChange={(open) => !open && setSelectedCaseStudy(null)}>
          {selectedCaseStudy && (
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
              <DialogHeader className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedCaseStudy.category || "Case Study"}
                  </Badge>
                  {selectedCaseStudy.live && (
                    <a
                      href={selectedCaseStudy.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      <span>Visit Live Application</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <DialogTitle className="font-heading text-2xl sm:text-3xl font-bold">
                  {selectedCaseStudy.name}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  {selectedCaseStudy.description}
                </DialogDescription>
              </DialogHeader>

              {/* Technologies */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                  Technology Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCaseStudy.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-foreground border border-border/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Problem / Solution / Outcome Breakdown */}
              {selectedCaseStudy.caseStudy && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 dark:bg-red-950/20">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold text-sm mb-1.5">
                      <AlertCircle className="h-4 w-4" />
                      <h4>The Problem</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                      {selectedCaseStudy.caseStudy.problem}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-950/20">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      <h4>The Engineering Solution</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                      {selectedCaseStudy.caseStudy.solution}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-1.5">
                      <TrendingUp className="h-4 w-4" />
                      <h4>Business Outcome</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                      {selectedCaseStudy.caseStudy.outcome}
                    </p>
                  </div>
                </div>
              )}

              {/* Screenshots preview */}
              {selectedCaseStudy.screenshots && selectedCaseStudy.screenshots.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border/60">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
                    Project Gallery
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedCaseStudy.screenshots.slice(0, 4).map((shot, idx) => (
                      <img
                        key={idx}
                        src={shot}
                        alt={`${selectedCaseStudy.name} preview ${idx + 1}`}
                        className="rounded-lg border border-border/50 object-cover w-full h-28"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </DialogContent>
          )}
        </Dialog>
      </div>
    </section>
  );
};

export default PortfolioShowcase;
