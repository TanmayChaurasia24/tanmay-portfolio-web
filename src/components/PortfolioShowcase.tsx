import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
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
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Github,
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

// Static projects data extracted from portfolio.json
const WEB_PROJECTS: ShowcaseProject[] = portfolioData.portfolioShowcase.webApps || [];
const MOBILE_PROJECTS: ShowcaseProject[] = portfolioData.portfolioShowcase.mobileApps || [];
const ALL_PROJECTS: ShowcaseProject[] = [...WEB_PROJECTS, ...MOBILE_PROJECTS];
const CATEGORIES = ["All", "Web Applications", "Mobile Applications", "Backend & APIs"] as const;

/* ─── Project Thumbnail Carousel ───────────────────── */
const ProjectCarousel = ({
  screenshots,
  name,
}: {
  screenshots: string[];
  name: string;
}) => {
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
    <div className="relative group/carousel overflow-hidden rounded-t-xl select-none">
      <div className="aspect-[16/10] bg-muted overflow-hidden relative">
        <img
          src={screenshots[current]}
          alt={`${name} screenshot ${current + 1}`}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/carousel:scale-[1.02]"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none opacity-40 group-hover/carousel:opacity-70 transition-opacity" />
      </div>

      {screenshots.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/85 backdrop-blur-sm border border-border/60 shadow-md opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-background z-10"
            aria-label="Previous screenshot"
          >
            <ChevronLeft className="h-3.5 w-3.5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/85 backdrop-blur-sm border border-border/60 shadow-md opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-background z-10"
            aria-label="Next screenshot"
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
                aria-label={`Go to screenshot ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ─── Main 3D Circular Project Carousel Section ────── */
const PortfolioShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<ShowcaseProject | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  const filteredProjects = useMemo(() => {
    return ALL_PROJECTS.filter((project) => {
      if (activeCategory === "All") return true;
      if (activeCategory === "Web Applications") {
        return WEB_PROJECTS.some((p) => p.id === project.id);
      }
      if (activeCategory === "Mobile Applications") {
        return MOBILE_PROJECTS.some((p) => p.id === project.id);
      }
      if (activeCategory === "Backend & APIs") {
        const backendTechs = ["Node.js", "Express", "Prisma", "PostgreSQL", "MongoDB", "Supabase"];
        return project.technologies.some((tech) => backendTechs.includes(tech));
      }
      return true;
    });
  }, [activeCategory]);

  // Handle responsive viewport size
  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  /* ─── 3D Circular Transform Engine ───────────────── */
  const apply3DTransforms = useCallback((targetFloat: number) => {
    const cards = cardRefs.current;
    const N = filteredProjects.length;
    if (N === 0) return;

    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const radius = isTablet ? 720 : 920;
    const stepAngle = isTablet ? 0.48 : 0.42; // radians per card

    for (let i = 0; i < N; i++) {
      const card = cards[i];
      if (!card) continue;

      // Calculate circular distance
      let offset = i - targetFloat;
      if (N > 4) {
        while (offset > N / 2) offset -= N;
        while (offset < -N / 2) offset += N;
      }

      // Outside front arc -> hide to optimize rendering
      if (Math.abs(offset) > 2.3) {
        card.style.opacity = "0";
        card.style.pointerEvents = "none";
        card.style.visibility = "hidden";
        continue;
      }

      card.style.visibility = "visible";

      // Circular coordinates on cylindrical curve
      const angle = offset * stepAngle;
      const x = Math.sin(angle) * radius;
      const z = (Math.cos(angle) - 1) * (radius * 0.75);
      const rotateY = -offset * (isTablet ? 22 : 24); // inward rotation in degrees
      const scale = Math.max(0.72, 1.0 - Math.abs(offset) * 0.16);
      const opacity = Math.max(0, Math.min(1, 1.0 - Math.pow(Math.abs(offset) / 2.1, 1.6)));
      const zIndex = Math.round(100 - Math.abs(offset) * 20);

      // Centered with translate(-50%, -50%) then cylindrical 3D offset and rotation
      card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, 0px, ${z.toFixed(1)}px) rotateY(${rotateY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      card.style.opacity = opacity.toFixed(3);
      card.style.zIndex = String(zIndex);

      // Subtle depth-of-field blur on far neighbor cards
      card.style.filter = Math.abs(offset) > 1.3 ? "blur(1px)" : "none";

      // Only the focused card allows full interactions; neighbors are clickable to rotate
      if (Math.abs(offset) < 0.4) {
        card.style.pointerEvents = "auto";
        card.style.cursor = "default";
      } else {
        card.style.pointerEvents = "auto";
        card.style.cursor = "pointer";
      }
    }
  }, [filteredProjects.length]);

  /* ─── Scroll-Driven Pinning & Rotation ───────────── */
  useEffect(() => {
    if (!isDesktop || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const N = filteredProjects.length;
    if (N === 0) return;

    // Reset initial card positions
    apply3DTransforms(0);
    setActiveIndex(0);

    if (prefersReducedMotion) return;

    ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          // Float index from 0 to N - 1
          const floatIdx = p * (N - 1);
          apply3DTransforms(floatIdx);

          const rounded = Math.min(N - 1, Math.max(0, Math.round(floatIdx)));
          setActiveIndex((prev) => (prev !== rounded ? rounded : prev));
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isDesktop, filteredProjects.length, apply3DTransforms]);

  /* ─── Scroll directly to a selected project ──────── */
  const scrollToProject = useCallback((idx: number) => {
    if (!containerRef.current) return;
    const N = filteredProjects.length;
    if (N <= 1) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const containerTop = rect.top + window.scrollY;
    const scrollDistance = container.offsetHeight - window.innerHeight;

    const targetProgress = idx / (N - 1);
    const targetScroll = containerTop + targetProgress * scrollDistance;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  }, [filteredProjects.length]);

  const goToPrev = () => {
    const nextIdx = activeIndex === 0 ? filteredProjects.length - 1 : activeIndex - 1;
    scrollToProject(nextIdx);
  };

  const goToNext = () => {
    const nextIdx = activeIndex === filteredProjects.length - 1 ? 0 : activeIndex + 1;
    scrollToProject(nextIdx);
  };

  // Scroll distance on desktop: proportional to project count for comfortable pacing
  const scrollHeightVh = Math.max(260, filteredProjects.length * 45);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full bg-background"
      style={{ height: isDesktop ? `${scrollHeightVh}vh` : "auto" }}
    >
      {/* ── DESKTOP & TABLET: Pinned 3D Circular Carousel ─ */}
      {isDesktop ? (
        <div className="sticky top-0 left-0 w-full h-screen flex flex-col justify-between py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
          
          {/* Top Section Header & Index Bar */}
          <div className="relative z-20 max-w-6xl w-full mx-auto">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest pb-4 border-b border-border/50">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="font-bold text-[#4f46e5] text-sm">(03)</span>
                <span className="font-bold text-foreground">FEATURED WORK</span>
                <span className="hidden md:inline text-muted-foreground/60">
                  · Production Web & Mobile Applications
                </span>
              </div>

              {/* Active Project Counter */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-foreground bg-[#4f46e5]/15 px-3 py-1 rounded-full border border-[#4f46e5]/30 shadow-xs">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(filteredProjects.length).padStart(2, "0")}
                </span>
                <span className="hidden sm:inline font-semibold text-foreground/90 tracking-tight">
                  {filteredProjects[activeIndex]?.name}
                </span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    scrollToProject(0);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-[#4f46e5] text-white shadow-xs font-semibold"
                      : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ── 3D Circular Carousel Stage ──────────────── */}
          <div
            className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex items-center justify-center my-auto"
            style={{
              perspective: "1200px",
              perspectiveOrigin: "50% 50%",
            }}
          >
            <div
              className="w-full h-[520px] relative flex items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              {filteredProjects.map((project, idx) => {
                const isFocused = activeIndex === idx;
                const isMobileApp = MOBILE_PROJECTS.some((p) => p.id === project.id);
                const isBackendApp = project.technologies.some((tech) =>
                  ["Node.js", "Express", "Prisma", "PostgreSQL", "MongoDB"].includes(tech)
                );

                return (
                  <div
                    key={project.id}
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    onClick={() => {
                      if (!isFocused) {
                        scrollToProject(idx);
                      }
                    }}
                    className="absolute top-1/2 left-1/2 w-[480px] lg:w-[540px] max-w-[88vw] will-change-transform"
                    style={{
                      transformStyle: "preserve-3d",
                      transition: "box-shadow 0.3s ease, border-color 0.3s ease",
                    }}
                  >
                    <Card
                      className={`w-full rounded-2xl sm:rounded-3xl border overflow-hidden relative backdrop-blur-xl flex flex-col justify-between transition-all duration-300 ${
                        isFocused
                          ? "border-[#6366f1]/70 bg-card/95 dark:bg-[#131316]/95 shadow-[0_25px_65px_-12px_rgba(79,70,229,0.38),0_0_35px_rgba(129,140,248,0.18)] ring-2 ring-[#818cf8]/40"
                          : "border-border/60 bg-card/85 dark:bg-[#121215]/90 shadow-xl opacity-80 hover:opacity-100 hover:border-border"
                      }`}
                      style={{ maxHeight: "530px" }}
                    >
                      {/* Top rim highlight on focused card */}
                      {isFocused && (
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#818cf8] to-transparent opacity-90 z-20 pointer-events-none" />
                      )}

                      <div>
                        {/* Screenshots carousel */}
                        <ProjectCarousel
                          screenshots={project.screenshots}
                          name={project.name}
                        />

                        <CardContent className="p-5 sm:p-6 pb-3">
                          {/* Category and Live Badge */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <Badge
                              variant="secondary"
                              className="text-[11px] font-semibold px-2.5 py-0.5 bg-[#4f46e5]/10 text-[#818cf8] border border-[#4f46e5]/25"
                            >
                              {isMobileApp
                                ? "Mobile Application"
                                : isBackendApp
                                ? "Full-Stack Web"
                                : "Web Application"}
                            </Badge>

                            {project.live && (
                              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-500 font-medium font-mono">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Live In Production</span>
                              </span>
                            )}
                          </div>

                          {/* Project Name */}
                          <CardTitle className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-1.5 tracking-tight group-hover:text-primary transition-colors">
                            {project.name}
                          </CardTitle>

                          {/* Description */}
                          <CardDescription className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                            {project.description}
                          </CardDescription>

                          {/* Tech Stack Badges */}
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {project.technologies.slice(0, 5).map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-mono bg-muted/80 text-muted-foreground border border-border/50"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 5 && (
                              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-muted-foreground/60">
                                +{project.technologies.length - 5}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </div>

                      {/* Footer Action Buttons */}
                      <div className="p-5 sm:p-6 pt-0 border-t border-border/30 mt-auto flex items-center gap-2.5">
                        {project.caseStudy && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCaseStudy(project);
                            }}
                            className="text-xs font-semibold flex-1 h-9 gap-1.5 rounded-xl border-border/70 hover:bg-muted shadow-2xs"
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>Case Study</span>
                          </Button>
                        )}

                        {project.live && (
                          <Button
                            size="sm"
                            asChild
                            className="text-xs font-semibold flex-1 h-9 gap-1.5 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-xs"
                          >
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>Live Demo</span>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        )}

                        {!project.live && project.github && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-xs font-semibold flex-1 h-9 gap-1.5 rounded-xl border-border/70 hover:bg-muted shadow-2xs"
                          >
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github className="h-3.5 w-3.5" />
                              <span>Code</span>
                            </a>
                          </Button>
                        )}
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Bottom Controls: Carousel Stepper & Arrows ── */}
          <div className="relative z-20 max-w-6xl w-full mx-auto pt-3 border-t border-border/50 flex items-center justify-between">
            {/* Prev Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrev}
              className="rounded-full w-9 h-9 border-border/60 hover:border-[#6366f1] hover:text-[#6366f1] transition-all"
              aria-label="Previous project"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-2">
              {filteredProjects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToProject(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "bg-[#6366f1] w-7"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/60 w-1.5"
                  }`}
                  aria-label={`Jump to project ${i + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="rounded-full w-9 h-9 border-border/60 hover:border-[#6366f1] hover:text-[#6366f1] transition-all"
              aria-label="Next project"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

        </div>
      ) : (
        /* ── MOBILE: Horizontal Swipeable Carousel ────────── */
        <div className="py-16 px-4 sm:px-6">
          <div className="max-w-xl mx-auto">
            {/* Top Index Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest pb-4 border-b border-border/50 mb-6">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#4f46e5] text-sm">(03)</span>
                <span className="font-bold text-foreground">FEATURED WORK</span>
              </div>
              <span>{filteredProjects.length} Projects</span>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto gap-2 pb-4 mb-4 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-[#4f46e5] text-white font-semibold"
                      : "bg-muted/70 text-muted-foreground border border-border/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Horizontal Snap Scroll Track */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 pt-2 scrollbar-none -mx-4 px-4">
              {filteredProjects.map((project) => {
                const isMobileApp = MOBILE_PROJECTS.some((p) => p.id === project.id);
                const isBackendApp = project.technologies.some((tech) =>
                  ["Node.js", "Express", "Prisma", "PostgreSQL", "MongoDB"].includes(tech)
                );

                return (
                  <div
                    key={project.id}
                    className="snap-center shrink-0 w-[84vw] max-w-sm"
                  >
                    <Card className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-lg flex flex-col justify-between h-full">
                      <div>
                        <ProjectCarousel
                          screenshots={project.screenshots}
                          name={project.name}
                        />

                        <CardContent className="p-4 pb-2">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0.5">
                              {isMobileApp
                                ? "Mobile App"
                                : isBackendApp
                                ? "Full-Stack Web"
                                : "Web App"}
                            </Badge>
                            {project.live && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Live</span>
                              </span>
                            )}
                          </div>

                          <CardTitle className="font-heading text-lg font-bold text-foreground mb-1">
                            {project.name}
                          </CardTitle>

                          <CardDescription className="text-xs text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
                            {project.description}
                          </CardDescription>

                          <div className="flex flex-wrap gap-1 mb-2">
                            {project.technologies.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground border border-border/40"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </div>

                      <div className="p-4 pt-0 border-t border-border/30 mt-auto flex items-center gap-2">
                        {project.caseStudy && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCaseStudy(project)}
                            className="text-xs font-semibold flex-1 h-8 gap-1 rounded-lg"
                          >
                            <BookOpen className="h-3 w-3" />
                            <span>Case Study</span>
                          </Button>
                        )}
                        {project.live && (
                          <Button
                            size="sm"
                            asChild
                            className="text-xs font-semibold flex-1 h-8 gap-1 rounded-lg bg-[#4f46e5] text-white"
                          >
                            <a href={project.live} target="_blank" rel="noopener noreferrer">
                              <span>Live Demo</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Case Study Modal Dialog (Preserved with full breakdown) ─ */}
      <Dialog
        open={!!selectedCaseStudy}
        onOpenChange={(open) => !open && setSelectedCaseStudy(null)}
      >
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
                    className="text-xs text-[#4f46e5] hover:underline inline-flex items-center gap-1 font-medium"
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
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 font-mono">
                Technology Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedCaseStudy.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-muted text-foreground border border-border/50"
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
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 font-mono">
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
    </section>
  );
};

export default PortfolioShowcase;
