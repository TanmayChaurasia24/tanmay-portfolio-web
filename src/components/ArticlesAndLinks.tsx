import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ExternalLink,
  BookOpen,
  Calendar,
  Clock,
  Heart,
  Share2,
  Sparkles,
  ArrowRight,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandInstagram,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import portfolioData from "../data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

interface Article {
  id: number;
  title: string;
  description: string;
  url: string;
  published_at?: string;
  readable_publish_date?: string;
  reading_time_minutes?: number;
  tags?: string[];
  cover_image?: string;
  reactions?: number;
}

const DevToIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 448 512" className={className} fill="currentColor">
    <path d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.54h17.45c3.88 0 7.77-1.45 11.65-4.35s5.82-7.25 5.82-13.06v-69.72c-.01-5.8-1.96-10.15-5.83-13.06zM404.1 32H43.9C19.7 32 .06 51.69 0 75.8v360.4C.06 460.31 19.7 480 43.9 480h360.2c24.21 0 43.84-19.69 43.9-43.8V75.8c-.06-24.11-19.69-43.8-43.9-43.8zM154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.38 28.49 47.38 47.25v70.96zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16 0-20.58-9.42-20.58-20.58V193.55c0-11.16 9.42-20.58 20.58-20.58h62.18v29.56zm100.55 137.93l-28.53-73.66-28.53 73.66h-32.96l41.6-107.31-41.6-107.3h33.22l28.27 73.41 28.27-73.41h33.22l-41.6 107.3 41.6 107.31h-33.08z" />
  </svg>
);

const getPlatformMeta = (icon: string) => {
  switch (icon) {
    case "github":
      return {
        icon: IconBrandGithub,
        badge: "Code & Projects",
        btnText: "View GitHub",
        accent: "hover:border-foreground/40 hover:shadow-foreground/5",
        iconColor: "text-foreground",
      };
    case "linkedin":
      return {
        icon: IconBrandLinkedin,
        badge: "Professional",
        btnText: "Connect on LinkedIn",
        accent: "hover:border-[#0077b5]/60 hover:shadow-[#0077b5]/10",
        iconColor: "text-[#0077b5]",
      };
    case "twitter":
      return {
        icon: IconBrandX,
        badge: "Discussions & Updates",
        btnText: "Follow on X",
        accent: "hover:border-foreground/40 hover:shadow-foreground/5",
        iconColor: "text-foreground",
      };
    case "instagram":
      return {
        icon: IconBrandInstagram,
        badge: "Visual & Stories",
        btnText: "Follow on Instagram",
        accent: "hover:border-[#e1306c]/60 hover:shadow-[#e1306c]/10",
        iconColor: "text-[#e1306c]",
      };
    case "devto":
      return {
        icon: DevToIcon,
        badge: "Tech Blog & Guides",
        btnText: "Read on Dev.to",
        accent: "hover:border-primary/60 hover:shadow-primary/10",
        iconColor: "text-foreground",
      };
    case "calendar":
      return {
        icon: Calendar,
        badge: "1:1 Discovery Call",
        btnText: "Book Discussion",
        accent: "hover:border-emerald-500/60 hover:shadow-emerald-500/10",
        iconColor: "text-emerald-500",
      };
    case "mail":
    default:
      return {
        icon: Mail,
        badge: "Direct Email",
        btnText: "Send Email",
        accent: "hover:border-indigo-500/60 hover:shadow-indigo-500/10",
        iconColor: "text-indigo-500",
      };
  }
};

const ArticlesAndLinks: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const articlesRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  const initialArticles: Article[] =
    (portfolioData as unknown as { articles?: Article[] }).articles || [];

  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [loading, setLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Fetch latest Dev.to articles dynamically
  useEffect(() => {
    let isMounted = true;
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://dev.to/api/articles?username=tanmay2627");
        if (!res.ok) throw new Error("Failed to fetch Dev.to articles");
        const data = await res.json();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const formatted: Article[] = data.slice(0, 6).map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            url: item.url,
            published_at: item.published_at,
            readable_publish_date: item.readable_publish_date,
            reading_time_minutes: item.reading_time_minutes,
            tags: item.tag_list,
            cover_image: item.social_image || item.cover_image,
            reactions: item.public_reactions_count || 0,
          }));
          setArticles(formatted);
        }
      } catch (err) {
        console.warn("Dev.to API offline or rate-limited, using preloaded data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArticles();
    return () => {
      isMounted = false;
    };
  }, []);

  // GSAP Entrance Animations
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

      const articleCards = articlesRef.current?.children;
      if (articleCards) {
        gsap.fromTo(
          articleCards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: articlesRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      const linkCards = linksRef.current?.children;
      if (linkCards) {
        gsap.fromTo(
          linkCards,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: "power2.out",
            scrollTrigger: {
              trigger: linksRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [articles.length]);

  const copyToClipboard = (text: string, label: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(label);
      toast.success(`Copied ${label} to clipboard!`);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  return (
    <section
      id="links"
      ref={sectionRef}
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-background relative overflow-hidden"
    >
      {/* Anchor alias so any link pointing to #contact or #articles lands here smoothly */}
      <div id="contact" className="sr-only" aria-hidden="true" />
      <div id="articles" className="sr-only" aria-hidden="true" />

      {/* Subtle ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Top Section Index Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest pb-8 border-b border-border/50 mb-12 sm:mb-16">
          <div className="flex items-center gap-4">
            <span className="font-bold text-foreground">(08)</span>
            <span className="text-border">/</span>
            <span>Writing & Social Profiles</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-500 font-semibold lowercase">live synced</span>
          </div>
        </div>

        {/* Section Title */}
        <div ref={titleRef} className="max-w-3xl mb-16 sm:mb-20">
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 text-xs font-mono border-primary/30 text-primary bg-primary/5"
          >
            Engineering Articles & Verified Profiles
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Writing, Technical Insights & All My Links.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            I write practical breakdowns on software architecture, autonomous AI agents,
            and scalable DevOps. Explore my published articles from Dev.to below or connect
            directly across my platforms.
          </p>
        </div>

        {/* ── PART 1: DEV.TO ARTICLES ─────────────────────── */}
        <div className="mb-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-card border border-border/80 text-foreground">
                <DevToIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-foreground">
                  Published on Dev.to
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  @tanmay2627 · Backend, AI & DevOps Guides
                </p>
              </div>
            </div>

            <a
              href="https://dev.to/tanmay2627"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group"
            >
              <span>View all articles on Dev.to</span>
              <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Articles Grid */}
          <div
            ref={articlesRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {articles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-2xl bg-card/60 dark:bg-card/40 border border-border/70 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 overflow-hidden"
              >
                {/* Cover Banner */}
                {article.cover_image && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/40 border-b border-border/40">
                    <img
                      src={article.cover_image}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  </div>
                )}

                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  {/* Meta Details */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {article.readable_publish_date || "Recent"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.reading_time_minutes || 3} min read
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-heading text-base sm:text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {article.title}
                  </h4>

                  {/* Description Excerpt */}
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4 flex-1">
                    {article.description}
                  </p>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/40 mt-auto">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted/80 text-foreground/75"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Read Link */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mt-4 pt-2">
                    <span>Read on Dev.to</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── PART 2: ALL LINKS & SOCIALS HUB ─────────────── */}
        <div>
          <div className="pb-6 border-b border-border/40 mb-8">
            <h3 className="text-xl font-bold font-heading text-foreground">
              All Profiles & Verified Links
            </h3>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              Direct access to code repositories, professional networks, social profiles & discovery calls
            </p>
          </div>

          <div
            ref={linksRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {portfolioData.social.map((item, idx) => {
              const meta = getPlatformMeta(item.icon);
              const IconComp = meta.icon;

              return (
                <div
                  key={idx}
                  className={`group relative p-5 sm:p-6 rounded-2xl bg-card/70 border border-border/70 ${meta.accent} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between`}
                >
                  <div>
                    {/* Top row: Icon + Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-background border border-border/80 shadow-xs">
                        <IconComp className={`h-5 w-5 ${meta.iconColor}`} />
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-mono font-medium px-2 py-0.5"
                      >
                        {meta.badge}
                      </Badge>
                    </div>

                    {/* Name & Handle */}
                    <h4 className="font-heading text-base font-bold text-foreground">
                      {item.name}
                    </h4>
                    <p className="text-xs font-mono text-primary mt-0.5 truncate">
                      {item.handle}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-border/40 flex items-center gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-semibold justify-between h-9 group-hover:border-primary/50 group-hover:text-primary transition-colors"
                    >
                      <a
                        href={item.url}
                        target={item.url.startsWith("mailto:") ? "_self" : "_blank"}
                        rel="noopener noreferrer"
                      >
                        <span>{meta.btnText}</span>
                        <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                      </a>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        copyToClipboard(item.url, item.name)
                      }
                      title={`Copy ${item.name} link`}
                      aria-label={`Copy ${item.name} link`}
                    >
                      {copiedLink === item.name ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Fast Contact Banner */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-card via-card to-primary/5 border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h4 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Want to kick off a project or discuss an architecture?
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Book a 1:1 call directly via Cal.com or drop an email to discuss timelines and scope.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs h-10 px-5 rounded-xl shadow-md shadow-primary/20"
              >
                <a
                  href={portfolioData.personal.calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Book Call on Cal.com</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                className="font-semibold text-xs h-10 px-4 rounded-xl"
              >
                <a
                  href={`mailto:${portfolioData.personal.email}`}
                  className="inline-flex items-center gap-2"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Email Me</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesAndLinks;
