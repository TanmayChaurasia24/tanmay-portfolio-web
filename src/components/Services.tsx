import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Check, ArrowRight } from "lucide-react";
import portfolioData from "../data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<any>> = {
  monitor: Monitor,
  smartphone: Smartphone,
};

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.15,
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

  return (
    <section id="services" ref={sectionRef} className="py-20 sm:py-24 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            What I Offer
          </span>
          <h2
            ref={titleRef}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-3 mb-4 solana-gradient-text"
          >
            Services
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            End-to-end development services tailored to your business needs
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto"
        >
          {portfolioData.services.map((service) => {
            const Icon = iconMap[service.icon] || Monitor;

            return (
              <Card
                key={service.id}
                className="glass-card group relative overflow-hidden"
              >
                {/* Gradient accent at top */}
                <div className="absolute top-0 left-0 right-0 h-1 professional-gradient" />

                <CardHeader className="pb-2 pt-8 px-6 sm:px-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3.5 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl font-bold">
                      {service.title}
                    </CardTitle>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {service.description}
                  </p>
                </CardHeader>

                <CardContent className="px-6 sm:px-8 pb-8">
                  <ul className="space-y-3.5 mb-8">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="p-0.5 bg-green-500/10 rounded-full mt-0.5 flex-shrink-0">
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        </div>
                        <span className="text-sm text-foreground/80 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full professional-gradient text-white shadow-lg hover:shadow-xl transition-all font-medium h-11"
                    asChild
                  >
                    <a href="#pricing">
                      See Pricing
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
