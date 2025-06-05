
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
import { Award, Star, Calendar } from "lucide-react";
import portfolioData from "../data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

const Achievements = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);

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

      const achievementCards = achievementsRef.current?.children;
      if (achievementCards) {
        gsap.fromTo(
          achievementCards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: achievementsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "award":
        return <Award className="h-8 w-8 text-yellow-500" />;
      case "star":
        return <Star className="h-8 w-8 text-yellow-500" />;
      default:
        return <Award className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <section id="achievements" ref={sectionRef} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-center mb-16 solana-gradient-text"
        >
          Achievements & Certifications
        </h2>

        <div
          ref={achievementsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {portfolioData.achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className="group hover:shadow-xl transition-shadow duration-200 glass-card border-0 animated-border"
            >
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  {getIcon(achievement.icon)}
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold">
                      {achievement.title}
                    </CardTitle>
                    <CardDescription className="text-purple-600 font-medium">
                      {achievement.organization}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {achievement.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{achievement.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
