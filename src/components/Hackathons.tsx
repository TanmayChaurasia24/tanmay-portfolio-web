
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
import { Trophy, Github, ExternalLink } from "lucide-react";
import portfolioData from "../data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

const Hackathons = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const hackathonsRef = useRef<HTMLDivElement>(null);

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

      const hackathonCards = hackathonsRef.current?.children;
      if (hackathonCards) {
        gsap.fromTo(
          hackathonCards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: hackathonsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hackathons" ref={sectionRef} className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Achievements</span>
          <h2
            ref={titleRef}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-4 solana-gradient-text"
          >
            Hackathons & Competitions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Award-winning projects from competitive coding challenges
          </p>
        </div>

        <div
          ref={hackathonsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {portfolioData.hackathons.map((hackathon) => (
            <Card
              key={hackathon.id}
              className="group glass-card h-full flex flex-col"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-yellow-500/10 rounded-xl">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  </div>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 font-semibold">
                    {hackathon.position}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {hackathon.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground font-medium">
                  {hackathon.project}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow flex flex-col">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {hackathon.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {hackathon.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs font-medium">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3 mt-auto">
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <a
                      href={hackathon.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-1" />
                      Code
                    </a>
                  </Button>

                  {hackathon.live && hackathon.live.length > 0 && (
                    <Button
                      size="sm"
                      className="flex-1 professional-gradient text-white"
                      asChild
                    >
                      <a
                        href={hackathon.live}
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

export default Hackathons;
