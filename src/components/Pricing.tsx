import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Check,
  ArrowRight,
  PhoneCall,
  Calendar,
  Sparkles,
  ShieldCheck,
  Code2,
  Workflow,
  Cpu,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import portfolioData from "../data/portfolio.json";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: string;
  projectType: string;
  features: string[];
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: "web-development",
    name: "Web Applications & MVPs",
    subtitle: "Frontend, Full-Stack & REST APIs",
    description:
      "Modern, responsive React/Next.js applications, performant REST APIs, and production databases built for speed and conversion.",
    icon: Code2,
    highlight: false,
    projectType: "Full-Stack Application",
    features: [
      "Custom responsive UI/UX (React, Next.js, Tailwind)",
      "Secure backend architecture & REST APIs",
      "Production database setup (PostgreSQL / MongoDB)",
      "Authentication, authorization & security standards",
      "Production deployment to cloud (Vercel, AWS)",
      "100% source code ownership & handover documentation",
      "14 days post-launch warranty & bug fixes",
    ],
  },
  {
    id: "ai-automation",
    name: "AI & Autonomous Workflows",
    subtitle: "n8n Pipelines & RAG Assistants",
    description:
      "Custom multi-step n8n automations, LLM agent pipelines, and knowledge-grounded RAG chatbots that eliminate repetitive business bottlenecks.",
    icon: Workflow,
    highlight: true,
    badge: "Most Requested",
    projectType: "AI Automation",
    features: [
      "Autonomous multi-step n8n workflow architecture",
      "AI model integration (OpenAI, Claude, Groq, Whisper)",
      "RAG knowledge assistant grounded on custom docs",
      "CRM, Slack, Email & Database two-way syncs",
      "Error handling, automatic retries & alert routing",
      "Full n8n workflow JSON export & node configuration",
      "Video walkthrough & operational handover guide",
    ],
  },
  {
    id: "dedicated-partnership",
    name: "Dedicated Sprint & Retainer",
    subtitle: "End-to-End Technical Partnership",
    description:
      "Continuous feature development, architecture oversight, recurring workflow optimization, and rapid turnaround for growing businesses.",
    icon: Cpu,
    highlight: false,
    projectType: "Other",
    features: [
      "Dedicated development hours per month",
      "Priority turnaround on new features & fixes",
      "Continuous workflow monitoring & API maintenance",
      "Direct Slack / WhatsApp communication channel",
      "Database tuning, security patches & scaling guidance",
      "Weekly progress updates & milestone demos",
      "Flexible monthly engagement with zero lock-in",
    ],
  },
];

const Pricing: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const calendarUrl =
    portfolioData.personal.calendarUrl || "https://cal.com/tammm2026";

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

      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleBookCall = (projectType: string) => {
    // Dispatch event to pre-select dropdown in Contact if needed
    window.dispatchEvent(
      new CustomEvent("select-project-type", { detail: { projectType } })
    );

    // Open Cal.com in a new tab for seamless 1-on-1 discovery booking
    window.open(calendarUrl, "_blank", "noopener,noreferrer");
  };

  const handleDiscussInMessage = (projectType: string) => {
    window.dispatchEvent(
      new CustomEvent("select-project-type", { detail: { projectType } })
    );
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-muted/15"
    >
      <div className="max-w-6xl mx-auto">
        {/* Top Section Index Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest pb-8 border-b border-border/50 mb-12 sm:mb-16">
          <div className="flex items-center gap-4">
            <span className="font-bold text-foreground">(07)</span>
            <span>PRICING & ENGAGEMENT</span>
          </div>
          <span>Tailored Scope · Transparent Investment</span>
        </div>

        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <Badge
            variant="outline"
            className="text-xs font-semibold uppercase tracking-wider mb-3 px-3 py-1 text-primary border-primary/30"
          >
            Engagement Models & Investment
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Custom Pricing for Every Project
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            No rigid templates or hidden fees. Every product is engineered to your exact roadmap, timeline, and requirements — let's discuss your scope and get you an accurate quote on a call.
          </p>
        </div>

        {/* 3 Pricing & Engagement Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-stretch mb-14"
        >
          {PRICING_TIERS.map((tier) => {
            const Icon = tier.icon;

            return (
              <Card
                key={tier.id}
                className={cn(
                  "relative flex flex-col justify-between rounded-2xl overflow-hidden transition-all duration-300",
                  tier.highlight
                    ? "border-2 border-primary/80 bg-card shadow-xl shadow-primary/10 ring-1 ring-primary/30"
                    : "border border-border/80 bg-card hover:border-border hover:shadow-md"
                )}
              >
                {/* Highlight Badge */}
                {tier.badge && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3.5 py-1.5 rounded-bl-xl uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>{tier.badge}</span>
                  </div>
                )}

                <CardHeader className="p-6 sm:p-7 pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={cn(
                        "p-2.5 rounded-xl flex items-center justify-center",
                        tier.highlight
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted text-primary border border-border/60"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        {tier.subtitle}
                      </p>
                      <CardTitle className="text-xl font-bold text-foreground">
                        {tier.name}
                      </CardTitle>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2 min-h-[48px]">
                    {tier.description}
                  </p>

                  {/* "Let's Discuss on a Call" Pricing Display */}
                  <div
                    className={cn(
                      "mt-5 p-4 rounded-xl border text-center transition-all",
                      tier.highlight
                        ? "bg-primary/10 border-primary/30 shadow-xs"
                        : "bg-muted/40 border-border/70"
                    )}
                  >
                    <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                      Pricing & Scope
                    </p>
                    <h4 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center justify-center gap-2">
                      <PhoneCall className="h-5 w-5 text-primary shrink-0" />
                      <span>Let's Discuss on a Call</span>
                    </h4>
                    <p className="text-[11px] text-primary font-medium mt-1">
                      Custom quote tailored to your specific roadmap
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="p-6 sm:p-7 pt-2 flex flex-col justify-between flex-grow">
                  <div className="mb-6">
                    <div className="h-px bg-border/50 my-4" />
                    <p className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground mb-3">
                      What's Included:
                    </p>
                    <ul className="space-y-2.5">
                      {tier.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90 leading-snug"
                        >
                          <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Call to Action Buttons */}
                  <div className="space-y-2 mt-auto">
                    <Button
                      variant={tier.highlight ? "default" : "outline"}
                      onClick={() => handleBookCall(tier.projectType)}
                      className={cn(
                        "w-full font-semibold h-11 gap-2 rounded-xl text-xs sm:text-sm shadow-xs cursor-pointer",
                        tier.highlight
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/25"
                          : "hover:border-primary hover:text-primary"
                      )}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Let's Discuss on a Call</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>

                    <button
                      onClick={() => handleDiscussInMessage(tier.projectType)}
                      className="w-full text-center text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors py-1 cursor-pointer"
                    >
                      Or send project details via message →
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Banner: Direct Discovery Call Booking */}
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-primary/5 p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-mono mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Zero Obligation · 15-Minute Free Consultation</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Have a unique product or workflow in mind?
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Whether you need a high-converting web app, an autonomous n8n pipeline, or full-stack software from scratch, let's jump on a quick 15-minute discovery call to map out feasibility, timeline, and exact investment.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <Button
                asChild
                className="w-full sm:w-auto font-semibold h-12 px-6 gap-2 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 cursor-pointer text-sm"
              >
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book a 15-Min Discovery Call</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto font-semibold h-12 px-5 gap-2 rounded-xl text-sm cursor-pointer"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Send Inquiry Form</span>
              </Button>
            </div>
          </div>

          {/* Guarantees Bar */}
          <div className="mt-8 pt-6 border-t border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs font-mono text-muted-foreground">
            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>100% Code Ownership</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Zero Vendor Lock-in</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Milestone Delivery</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Post-Launch Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
