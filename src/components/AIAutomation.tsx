import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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
  Workflow,
  Bot,
  Share2,
  FileText,
  Play,
  ExternalLink,
  Instagram,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Database,
  Terminal,
  Sparkles,
  AlertCircle,
  Video,
} from "lucide-react";
import portfolioData from "../data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

export type AutomationProject = {
  id: string;
  name: string;
  badge: string;
  description: string;
  problem: string;
  solution: string;
  outcome: string;
  technologies: string[];
  capabilities: string[];
  media: {
    reelUrl?: string;
    workflowImage?: string;
    chatbotImage?: string;
    postImage?: string;
    articleUrl?: string;
    demoUrl?: string;
  };
};

// Elegant schematic placeholder when real workflow image is still pending
const WorkflowSchematicPlaceholder = ({
  project,
}: {
  project: AutomationProject;
}) => {
  const getWorkflowSteps = (id: string) => {
    switch (id) {
      case "lead-capture":
        return [
          { label: "Webhook Trigger", type: "trigger", icon: Terminal },
          { label: "Data Validation & Intent", type: "process", icon: Cpu },
          { label: "Slack / Email Alert", type: "action", icon: Share2 },
          { label: "CRM / Sheets Sync", type: "output", icon: Database },
        ];
      case "rag-chatbot":
        return [
          { label: "Doc Ingestion", type: "trigger", icon: FileText },
          { label: "Vector Search", type: "process", icon: Database },
          { label: "Context Grounding", type: "process", icon: Bot },
          { label: "Streamed Response", type: "output", icon: Sparkles },
        ];
      case "linkedin-automation":
        return [
          { label: "Cron Schedule", type: "trigger", icon: Terminal },
          { label: "Topic AI Synthesis", type: "process", icon: Cpu },
          { label: "Markdown Formatting", type: "process", icon: Layers },
          { label: "LinkedIn OAuth2 API", type: "output", icon: Share2 },
        ];
      case "blog-publishing":
        return [
          { label: "Topic Intake", type: "trigger", icon: Terminal },
          { label: "Full Outline & Code", type: "process", icon: Cpu },
          { label: "Frontmatter Parser", type: "process", icon: Layers },
          { label: "DEV.to API Publish", type: "output", icon: FileText },
        ];
      default:
        return [
          { label: "Trigger Node", type: "trigger", icon: Terminal },
          { label: "AI Node", type: "process", icon: Cpu },
          { label: "Routing Node", type: "process", icon: Layers },
          { label: "Output Node", type: "output", icon: Database },
        ];
    }
  };

  const steps = getWorkflowSteps(project.id);

  return (
    <div className="relative p-5 rounded-t-xl bg-muted/40 border-b border-border/60 overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between mb-3 text-muted-foreground text-[11px]">
        <span className="flex items-center gap-1.5 font-semibold text-foreground">
          <Workflow className="h-3.5 w-3.5 text-primary" />
          n8n Workflow Pipeline Architecture
        </span>
        <Badge variant="outline" className="text-[10px] font-normal py-0 h-4 border-dashed">
          Schematic Preview
        </Badge>
      </div>

      {/* Nodes visualizer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-2">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="p-2.5 rounded-lg border border-border/80 bg-background/90 flex flex-col items-center text-center justify-center relative shadow-2xs"
            >
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center mb-1.5">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-semibold text-foreground text-[11px] leading-tight">
                {s.label}
              </span>
              <span className="text-[9px] text-muted-foreground uppercase mt-0.5">
                Step {idx + 1}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px] text-muted-foreground">
        <span>Single-Account Execution Guard</span>
        <span className="text-emerald-500 font-medium">● Production Schema Ready</span>
      </div>
    </div>
  );
};

const AIAutomation = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationProject | null>(null);
  const [activeDemoVideo, setActiveDemoVideo] = useState<string | null>(null);

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

  const workflows: AutomationProject[] = portfolioData.aiAutomation || [];

  const handleDiscussAutomation = (project: AutomationProject) => {
    const projectType =
      project.id === "rag-chatbot" ? "AI Chatbot / RAG" : "AI Automation";

    // Dispatch event to pre-select dropdown in Contact
    window.dispatchEvent(
      new CustomEvent("select-project-type", { detail: { projectType } })
    );

    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const isPlaceholderUrl = (url?: string) => {
    if (!url) return true;
    return url.startsWith("[ADD_") || url.trim() === "";
  };

  return (
    <section
      id="ai-automation"
      ref={sectionRef}
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-muted/15"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Section Index Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest pb-8 border-b border-border/50 mb-12 sm:mb-16">
          <div className="flex items-center gap-4">
            <span className="font-bold text-foreground">(04)</span>
            <span>AI & AUTOMATION</span>
          </div>
          <span>Autonomous n8n & RAG Systems</span>
        </div>

        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-14">
          <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider mb-3 px-3 py-1 text-primary border-primary/30">
            Intelligent Systems
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            AI & Workflow Automation
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Autonomous n8n workflows, RAG knowledge assistants, and multi-API pipelines engineered to eliminate repetitive operational bottlenecks.
          </p>
        </div>

        {/* 4 Workflows Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {workflows.map((project) => {
            const hasReel = !isPlaceholderUrl(project.media?.reelUrl);
            const hasDemo = !isPlaceholderUrl(project.media?.demoUrl);
            const hasArticle = !isPlaceholderUrl(project.media?.articleUrl);
            const hasWorkflowImg = !isPlaceholderUrl(project.media?.workflowImage);

            return (
              <Card
                key={project.id}
                className="border border-border/70 bg-card hover:border-border hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden rounded-xl"
              >
                <div>
                  {/* Visual Top: Real Screenshot or Clean Schematic Placeholder */}
                  {hasWorkflowImg ? (
                    <div className="aspect-[16/9] bg-muted overflow-hidden">
                      <img
                        src={project.media.workflowImage}
                        alt={`${project.name} workflow`}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <WorkflowSchematicPlaceholder project={project} />
                  )}

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge variant="secondary" className="text-[11px] font-medium">
                        {project.badge}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Automated Pipeline
                      </span>
                    </div>

                    <CardTitle className="text-xl font-bold text-foreground mb-3 leading-snug">
                      {project.name}
                    </CardTitle>

                    {/* Problem Statement Box */}
                    <div className="p-3.5 rounded-lg border border-border/60 bg-muted/30 mb-4 text-xs">
                      <p className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        Business Problem
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        {project.problem}
                      </p>
                    </div>

                    {/* What It Does */}
                    <p className="text-xs sm:text-sm text-foreground/90 mb-4 leading-relaxed">
                      {project.solution}
                    </p>

                    {/* Key Capabilities */}
                    <div className="space-y-1.5 mb-5">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                        Workflow Capabilities
                      </p>
                      {project.capabilities.map((cap, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="leading-snug">{cap}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-foreground border border-border/40"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </div>

                {/* Card Action Buttons */}
                <div className="p-6 pt-0 border-t border-border/30 mt-auto flex flex-wrap gap-2.5 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedWorkflow(project)}
                    className="text-xs font-semibold flex-1 h-9 gap-1.5"
                  >
                    <Workflow className="h-3.5 w-3.5" />
                    <span>View Architecture</span>
                  </Button>

                  {/* Reel Link Button */}
                  {project.media?.reelUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-xs font-semibold h-9 px-3 gap-1.5"
                    >
                      <a
                        href={
                          hasReel
                            ? project.media.reelUrl
                            : "https://www.instagram.com/"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        title={hasReel ? "Watch Instagram Reel" : "Reel URL to be added"}
                      >
                        <Instagram className="h-3.5 w-3.5 text-pink-500" />
                        <span>Watch Reel</span>
                      </a>
                    </Button>
                  )}

                  {/* Demo Video Button */}
                  {project.media?.demoUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (hasDemo && project.media.demoUrl) {
                          setActiveDemoVideo(project.media.demoUrl);
                        } else {
                          setSelectedWorkflow(project);
                        }
                      }}
                      className="text-xs font-semibold h-9 px-3 gap-1.5"
                    >
                      <Video className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Watch Demo</span>
                    </Button>
                  )}

                  {/* DEV.to Published Article Button */}
                  {project.media?.articleUrl && hasArticle && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-xs font-semibold h-9 px-3 gap-1.5"
                    >
                      <a
                        href={project.media.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>View on DEV.to</span>
                      </a>
                    </Button>
                  )}

                  <Button
                    size="sm"
                    onClick={() => handleDiscussAutomation(project)}
                    className="text-xs font-semibold h-9 px-3.5 gap-1.5 ml-auto"
                  >
                    <span>Automate This</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Workflow Architecture Dialog */}
        <Dialog open={!!selectedWorkflow} onOpenChange={(open) => !open && setSelectedWorkflow(null)}>
          {selectedWorkflow && (
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
              <DialogHeader className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedWorkflow.badge}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    n8n Workflow Blueprint
                  </span>
                </div>
                <DialogTitle className="font-heading text-2xl font-bold">
                  {selectedWorkflow.name}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  {selectedWorkflow.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                {/* Visual schematic */}
                <div className="border border-border/70 rounded-xl overflow-hidden">
                  <WorkflowSchematicPlaceholder project={selectedWorkflow} />
                </div>

                {/* Problem vs Solution */}
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-border/60 bg-muted/40">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                      Business Problem Solved
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {selectedWorkflow.problem}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                      Automated Pipeline Solution
                    </h4>
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                      {selectedWorkflow.solution}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                    <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                      Measurable Business Outcome
                    </h4>
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                      {selectedWorkflow.outcome}
                    </p>
                  </div>
                </div>

                {/* Tech and node stack */}
                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                    Integrated Tools & Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorkflow.technologies.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs font-mono">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Want this workflow tailored to your specific tools?
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedWorkflow(null);
                      handleDiscussAutomation(selectedWorkflow);
                    }}
                    className="font-semibold gap-1.5"
                  >
                    <span>Discuss Implementation</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>

        {/* Demo Video Modal */}
        <Dialog open={!!activeDemoVideo} onOpenChange={(open) => !open && setActiveDemoVideo(null)}>
          <DialogContent className="max-w-3xl p-6">
            <DialogHeader className="mb-3">
              <DialogTitle className="text-lg font-bold">Automation Demo Video</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Live walkthrough of the automated workflow execution.
              </DialogDescription>
            </DialogHeader>
            <div className="aspect-video bg-black/90 rounded-xl overflow-hidden flex items-center justify-center">
              {activeDemoVideo && activeDemoVideo.includes("http") ? (
                <iframe
                  src={activeDemoVideo}
                  title="Demo Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-center p-8 text-white/80">
                  <Video className="h-10 w-10 mx-auto mb-2 text-primary" />
                  <p className="font-semibold text-sm">Demo Video Asset Link</p>
                  <p className="text-xs text-white/60 max-w-sm mt-1">
                    Provide your hosted video URL or Google Drive / YouTube link in portfolio.json to embed the preview here.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default AIAutomation;
