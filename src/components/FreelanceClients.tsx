import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, ExternalLink, CheckCircle } from "lucide-react";
import portfolioData from "../data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

const FreelanceClients = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const clientsRef = useRef<HTMLDivElement>(null);

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

      const clientCards = clientsRef.current?.children;
      if (clientCards) {
        gsap.fromTo(
          clientCards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: clientsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const testimonials = portfolioData.freelanceClients || [];

  return (
    <section id="testimonials" ref={sectionRef} className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/40">
      <div className="max-w-6xl mx-auto">
        {/* Top Section Index Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest pb-8 border-b border-border/50 mb-12 sm:mb-16">
          <div className="flex items-center gap-4">
            <span className="font-bold text-foreground">(06)</span>
            <span>CLIENT REVIEWS</span>
          </div>
          <span>Direct Feedback on Delivered Projects</span>
        </div>

        <div ref={titleRef} className="text-center mb-14">
          <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider mb-3 px-3 py-1">
            Client Feedback
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Verified Client Reviews
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Direct feedback from business owners and founders for delivered web applications and e-commerce platforms.
          </p>
        </div>

        <div
          ref={clientsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((client) => (
            <Card
              key={client.id}
              className="border border-border/70 bg-card hover:border-border transition-colors flex flex-col justify-between p-6 rounded-xl shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(client.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-medium">
                    {client.year}
                  </Badge>
                </div>

                <Quote className="h-6 w-6 text-primary/30 mb-3" />

                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed mb-6 italic">
                  "{client.testimonial}"
                </p>
              </div>

              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">
                      {client.clientName}
                    </h3>
                    <p className="text-xs text-primary font-medium">
                      {client.projectType}
                    </p>
                  </div>

                  {client.live && (
                    <a
                      href={client.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="View live website"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreelanceClients;
