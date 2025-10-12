
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
import { Star, Clock, Quote, Github, ExternalLink } from "lucide-react";
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
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section id="freelance" ref={sectionRef} className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Testimonials</span>
          <h2
            ref={titleRef}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-4 solana-gradient-text"
          >
            Freelance Clients
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by clients worldwide to deliver high-quality solutions
          </p>
        </div>

        <div
          ref={clientsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {portfolioData.freelanceClients.map((client) => (
            <Card
              key={client.id}
              className="group glass-card h-full flex flex-col"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {renderStars(client.rating)}
                  </div>
                  <Badge variant="secondary" className="font-medium">{client.year}</Badge>
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {client.clientName}
                </CardTitle>
                <CardDescription className="text-primary font-semibold">
                  {client.projectType}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow flex flex-col">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {client.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {client.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs font-medium">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">{client.duration}</span>
                </div>

                <div className="bg-muted/50 p-4 rounded-xl mb-4 border border-border">
                  <div className="flex items-start gap-2">
                    <Quote className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm italic text-foreground leading-relaxed">
                      "{client.testimonial}"
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <a
                      href={client.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-1" />
                      Code
                    </a>
                  </Button>

                  {client.live && client.live.length > 0 && (
                    <Button
                      size="sm"
                      className="flex-1 professional-gradient text-white"
                      asChild
                    >
                      <a
                        href={client.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Live
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
