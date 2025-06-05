
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
    <section id="hackathons" ref={sectionRef} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-center mb-16 solana-gradient-text"
        >
          Hackathons & Competitions
        </h2>

        <div
          ref={hackathonsRef}
          className="flex flex-wrap gap-8 justify-center"
        >
          {portfolioData.hackathons.map((hackathon) => (
            <Card
              key={hackathon.id}
              className="group hover:shadow-xl transition-shadow duration-200 glass-card border-0 animated-border max-w-sm w-full"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <Badge variant="secondary" className="font-semibold">
                    {hackathon.position}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold">
                  {hackathon.name}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {hackathon.project}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  {hackathon.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {hackathon.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={hackathon.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Code
                    </a>
                  </Button>

                  {hackathon.live && hackathon.live.length > 0 && (
                    <Button
                      size="sm"
                      className="solana-gradient text-white"
                      asChild
                    >
                      <a
                        href={hackathon.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Live Demo
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
