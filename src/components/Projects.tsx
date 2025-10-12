import React, { useRef, useEffect, useMemo } from "react";
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
import { Github, ExternalLink } from "lucide-react";
import portfolioData from "../data/portfolio.json";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

gsap.registerPlugin(ScrollTrigger);

type Category = "All" | "Web" | "Blockchain" | "DevOps" | "Mobile";

const categorizeProject = (techs: string[]): Exclude<Category, "All"> => {
  const t = techs.map((s) => s.toLowerCase());
  if (t.some((x) => ["react native"].includes(x))) return "Mobile";
  if (t.some((x) => ["solana", "anchor", "rust"].includes(x))) return "Blockchain";
  if (t.some((x) => ["aws", "docker", "kubernetes", "terraform", "nginx", "jenkins", "github actions"].includes(x))) return "DevOps";
  return "Web";
};

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const projectsWithCategory = useMemo(() => {
    return portfolioData.projects.map((p) => ({
      ...p,
      category: categorizeProject(p.technologies),
    }));
  }, []);

  const categories: Category[] = ["All", "Web", "Blockchain", "DevOps", "Mobile"];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderCard = (project: any) => (
    <Card
      key={project.id}
      className="group hover:shadow-xl transition-shadow duration-200 glass-card border-0 animated-border max-w-sm w-full mx-auto"
    >
      <CardHeader>
        <div className="aspect-video bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg mb-4 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        </div>
        <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex gap-3">
          <Button size="sm" variant="outline" asChild>
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" /> Code
            </a>
          </Button>
          {project.live && project.live.length > 0 ? (
            <Button size="sm" className="solana-gradient text-white" asChild>
              <a href={project.live} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" /> Live Demo
              </a>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );

  const TabPanel = ({ cat }: { cat: Category }) => {
    const list = projectsWithCategory.filter((p) => (cat === "All" ? true : p.category === cat));
    return (
      <div className="relative">
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="-ml-2">
            {list.map((project) => (
              <CarouselItem key={project.id} className="basis-full sm:basis-1/2 lg:basis-1/3 pl-2">
                {renderCard(project)}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-6" />
          <CarouselNext className="-right-6" />
        </Carousel>
      </div>
    );
  };

  return (
    <section id="projects" ref={sectionRef} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-center mb-10 solana-gradient-text">
          Featured Projects
        </h2>

        <Tabs defaultValue="All" className="w-full">
          <div className="flex flex-col items-center">
            <TabsList className="mb-8">
              {categories.map((c) => (
                <TabsTrigger key={c} value={c} className="capitalize">
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {categories.map((c) => (
            <TabsContent key={c} value={c}>
              <TabPanel cat={c as Category} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Projects;
