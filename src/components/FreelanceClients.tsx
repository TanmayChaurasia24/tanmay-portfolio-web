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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Quote, ExternalLink } from "lucide-react";
import portfolioData from "../data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

const FreelanceClients = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const clientsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

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
          { opacity: 0, y: 40 },
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" ref={sectionRef} className="py-20 sm:py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Social Proof</span>
          <h2
            ref={titleRef}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-3 mb-4 solana-gradient-text"
          >
            What Clients Say
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Real feedback from real clients — every project delivered with care
          </p>
        </div>

        <div
          ref={clientsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto"
        >
          {portfolioData.freelanceClients.map((client) => (
            <Card
              key={client.id}
              className="group glass-card h-full flex flex-col overflow-hidden"
            >
              {/* Project screenshot header */}
              {client.screenshot && (
                <div className="aspect-[16/10] bg-muted overflow-hidden">
                  <img
                    src={client.screenshot}
                    alt={`${client.clientName} project`}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}

              <CardHeader className="px-5 sm:px-6 pt-5 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-0.5">
                    {renderStars(client.rating)}
                  </div>
                  <Badge variant="secondary" className="text-[11px] font-medium px-2 py-0.5">{client.year}</Badge>
                </div>
                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                  {client.clientName}
                </CardTitle>
                <CardDescription className="text-primary font-semibold text-sm">
                  {client.projectType}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow flex flex-col px-5 sm:px-6 pb-5 sm:pb-6">
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {client.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {client.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-[11px] font-medium px-2 py-0.5">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium">{client.duration}</span>
                </div>

                <div className="bg-muted/50 p-4 rounded-xl mb-5 border border-border/50">
                  <div className="flex items-start gap-2.5">
                    <Quote className="h-4 w-4 text-primary mt-0.5 flex-shrink-0 opacity-60" />
                    <p className="text-[13px] italic text-foreground/80 leading-relaxed line-clamp-4">
                      "{client.testimonial}"
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  {client.live && client.live.length > 0 && (
                    <Button
                      size="sm"
                      className="w-full professional-gradient text-white font-medium"
                      asChild
                    >
                      <a
                        href={client.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        View Project
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreelanceClients;
