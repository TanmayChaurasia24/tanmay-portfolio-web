
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
    <section id="freelance" ref={sectionRef} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-center mb-16 solana-gradient-text"
        >
          Freelance Clients
        </h2>

        <div
          ref={clientsRef}
          className="flex flex-wrap gap-8 justify-center"
        >
          {portfolioData.freelanceClients.map((client) => (
            <Card
              key={client.id}
              className="group hover:shadow-xl transition-shadow duration-200 glass-card border-0 animated-border max-w-sm w-full"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {renderStars(client.rating)}
                  </div>
                  <Badge variant="secondary">{client.year}</Badge>
                </div>
                <CardTitle className="text-xl font-bold">
                  {client.clientName}
                </CardTitle>
                <CardDescription className="text-purple-600 font-medium">
                  {client.projectType}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  {client.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {client.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span>{client.duration}</span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-4">
                  <div className="flex items-start gap-2">
                    <Quote className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />
                    <p className="text-sm italic text-gray-700 dark:text-gray-300">
                      "{client.testimonial}"
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={client.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Code
                    </a>
                  </Button>

                  {client.live && client.live.length > 0 && (
                    <Button
                      size="sm"
                      className="solana-gradient text-white"
                      asChild
                    >
                      <a
                        href={client.live}
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

export default FreelanceClients;
