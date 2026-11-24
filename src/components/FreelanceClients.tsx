import React, { useRef, useState, useEffect } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Quote,
  ExternalLink,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Sparkles,
  ShieldCheck,
  MousePointerClick,
} from "lucide-react";
import portfolioData from "../data/portfolio.json";
import { TechLogo } from "./TechLogo";
import { cn } from "@/lib/utils";

export interface ClientReview {
  id: number;
  clientName: string;
  projectType: string;
  description: string;
  technologies: string[];
  duration: string;
  year: string;
  rating: number;
  testimonial: string;
  screenshot: string;
  live?: string;
}

const FreelanceClients: React.FC = () => {
  const testimonials: ClientReview[] = portfolioData.freelanceClients || [];
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);

  // Auto-advance client reviews every 7 seconds unless user interacts
  useEffect(() => {
    if (!isAutoPlay || testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlay, testimonials.length]);

  const activeClient = testimonials[activeIdx] || testimonials[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAutoPlay(false);
    setActiveIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAutoPlay(false);
    setActiveIdx((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className="border-t border-border/40 overflow-hidden bg-background">
      <ContainerScroll
        titleComponent={
          <div className="text-center mb-8 px-4">
            {/* Top Section Index Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest pb-6 border-b border-border/50 mb-8 max-w-5xl mx-auto">
              <div className="flex items-center gap-4">
                <span className="font-bold text-foreground">(06)</span>
                <span>CLIENT REVIEWS</span>
              </div>
              <span>Direct Feedback on Delivered Projects</span>
            </div>

            <Badge
              variant="outline"
              className="text-xs font-semibold uppercase tracking-wider mb-3 px-3 py-1 text-primary border-primary/30"
            >
              Client Feedback & Proof
            </Badge>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Verified Client Reviews
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Scroll to tilt into the client console — click the highlighted arrows or client tabs to explore real delivered software.
            </p>
          </div>
        }
      >
        {/* Tablet / Screen Interior Container */}
        <div
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
          className="relative h-full w-full flex flex-col justify-between bg-card text-card-foreground select-none overflow-hidden"
        >
          {/* Tablet Console Top Window Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-muted/60 border-b border-border/60 text-xs">
            {/* Window control dots */}
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block shadow-xs" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block shadow-xs" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block shadow-xs" />
            </div>

            {/* URL bar indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-background/90 border border-border/70 text-[11px] font-mono text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>tanmay.dev/clients/verified-reviews</span>
            </div>

            {/* Live rating badge & Click hint */}
            <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs font-mono">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>5.0 / 5.0 (100% 5★)</span>
            </div>
          </div>

          {/* Client Selection Tab Navigation Bar with Highlighted Controller */}
          <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-3 sm:px-6 py-3 overflow-x-auto gap-3">
            {/* Bigger, prominent tabs */}
            <div className="flex items-center gap-2.5">
              {testimonials.map((client, idx) => (
                <button
                  key={client.id}
                  onClick={() => {
                    setIsAutoPlay(false);
                    setActiveIdx(idx);
                  }}
                  className={cn(
                    "px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2.5 cursor-pointer whitespace-nowrap border",
                    activeIdx === idx
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25 scale-[1.02]"
                      : "bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground border-border/70 hover:border-primary/40 shadow-2xs"
                  )}
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      activeIdx === idx
                        ? "bg-white animate-pulse"
                        : "bg-muted-foreground/50"
                    )}
                  />
                  <span>{client.clientName}</span>
                  <span
                    className={cn(
                      "hidden md:inline-block text-[11px] font-normal px-2 py-0.5 rounded-md",
                      activeIdx === idx
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {client.projectType}
                  </span>
                </button>
              ))}
            </div>

            {/* Prominent Highlighted Arrows Controller */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrev}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-background hover:bg-primary/10 text-primary border-2 border-primary/40 hover:border-primary shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer group active:scale-95"
                title="Previous Client Review"
                aria-label="Previous Review"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline text-xs font-bold">Prev</span>
              </button>

              <div className="hidden sm:flex items-center px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold border border-primary/20">
                {activeIdx + 1} / {testimonials.length}
              </div>

              <button
                onClick={handleNext}
                className="relative p-2 sm:px-4 sm:py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 transition-all duration-200 flex items-center gap-1.5 cursor-pointer group active:scale-95 animate-pulse-soft"
                title="Next Client Review"
                aria-label="Next Review"
              >
                <span className="text-xs sm:text-sm font-bold">Next</span>
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-0.5" />
                {/* Pulsing beacon highlight */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
                </span>
              </button>
            </div>
          </div>

          {/* Main Review Body with Floating Side Arrows */}
          <div className="relative flex-1 p-4 sm:p-8 overflow-y-auto">
            {/* Floating Left Side Arrow */}
            <button
              onClick={handlePrev}
              className="hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-background/95 hover:bg-primary text-primary hover:text-primary-foreground border-2 border-primary/60 hover:border-primary shadow-xl shadow-black/20 items-center justify-center transition-all duration-200 hover:scale-115 active:scale-90 cursor-pointer group"
              title="Previous Client"
              aria-label="Previous Client"
            >
              <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
            </button>

            {/* Floating Right Side Arrow (Highlighted with ring glow) */}
            <button
              onClick={handleNext}
              className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary shadow-xl shadow-primary/35 items-center justify-center transition-all duration-200 hover:scale-115 active:scale-90 cursor-pointer group ring-4 ring-primary/25"
              title="Next Client"
              aria-label="Next Client"
            >
              <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
            </button>

            {activeClient && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full px-1 sm:px-4">
                {/* Left Column: Live Screenshot Preview & Tech */}
                <div className="lg:col-span-5 flex flex-col gap-3.5">
                  <div className="relative group rounded-xl overflow-hidden border border-border/80 bg-muted aspect-[16/10] shadow-md">
                    <img
                      src={activeClient.screenshot}
                      alt={`${activeClient.clientName} delivered project`}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay with Live Button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      {activeClient.live && (
                        <Button
                          size="sm"
                          asChild
                          className="w-full text-xs font-semibold h-9 gap-1.5 bg-primary text-primary-foreground shadow-lg cursor-pointer"
                        >
                          <a
                            href={activeClient.live}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>Open Live Website</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Tech stack badges with logos */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {activeClient.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-muted/80 text-foreground border border-border/60"
                      >
                        <TechLogo name={tech} size={13} />
                        <span>{tech}</span>
                      </span>
                    ))}
                    <span className="text-xs font-mono text-muted-foreground ml-auto">
                      Delivered in {activeClient.duration}
                    </span>
                  </div>
                </div>

                {/* Right Column: Verified Testimonial Quote & Client Details */}
                <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-5">
                  {/* Rating & Project Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(activeClient.rating || 5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-500 text-amber-500"
                        />
                      ))}
                      <span className="text-xs sm:text-sm font-bold text-foreground ml-2 font-mono">
                        5.0 / 5.0
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium"
                      >
                        {activeClient.projectType}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs font-mono text-muted-foreground"
                      >
                        Year {activeClient.year}
                      </Badge>
                    </div>
                  </div>

                  {/* Testimonial Quote */}
                  <div className="relative pl-6 sm:pl-8 border-l-3 border-primary/50 py-2">
                    <Quote className="h-8 w-8 text-primary/20 absolute -left-4 -top-3" />
                    <p className="text-sm sm:text-base md:text-lg text-foreground/95 leading-relaxed italic font-serif">
                      "{activeClient.testimonial}"
                    </p>
                  </div>

                  {/* Client Identification & Live Action */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
                        <span>{activeClient.clientName}</span>
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 shrink-0" />
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {activeClient.description}
                      </p>
                    </div>

                    {activeClient.live && (
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="text-xs font-semibold h-9 px-4 gap-2 shrink-0 cursor-pointer hover:border-primary hover:text-primary"
                      >
                        <a
                          href={activeClient.live}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>Live Site</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Metric Bar with Click Prompt */}
          <div className="px-4 sm:px-6 py-3 bg-muted/40 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-foreground font-semibold">
                <MousePointerClick className="h-3.5 w-3.5 text-primary" />
                Click tabs or arrows to cycle ({activeIdx + 1}/{testimonials.length})
              </span>
              <span className="hidden sm:inline">● 100% On-Time Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-semibold">● Production Verified</span>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
};

export default FreelanceClients;
