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

  const renderCard = (project: {
    id: string | number;
    title: string;
    description: string;
    image: string;
    technologies: string[];
    github?: string;
    live?: string;
  }) => (
    <Card
      key={project.id}
      className="group glass-card max-w-sm w-full mx-auto h-full flex flex-col"
    >
      <CardHeader className="p-0">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-xl overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </CardHeader>
      <div className="p-6 flex flex-col flex-grow">
        <CardTitle className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </CardDescription>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.slice(0, 4).map((tech: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs font-medium">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 4 && (
            <Badge variant="secondary" className="text-xs font-medium">
              +{project.technologies.length - 4}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-3 mt-auto">
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-1" /> Code
            </a>
          </Button>
          {project.live && project.live.length > 0 ? (
            <Button size="sm" className="flex-1 professional-gradient text-white" asChild>
              <a href={project.live} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" /> Live
              </a>
            </Button>
          ) : null}
        </div>
      </div>
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
    <section id="projects" ref={sectionRef} className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Portfolio</span>
          <h2 ref={titleRef} className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-4 solana-gradient-text">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore my latest work in web development, blockchain, and mobile applications
          </p>
        </div>

        <Tabs defaultValue="All" className="w-full">
          <div className="flex flex-col items-center">
            <TabsList className="mb-12 bg-muted/50 p-1 rounded-xl">
              {categories.map((c) => (
                <TabsTrigger 
                  key={c} 
                  value={c} 
                  className="capitalize px-6 py-2.5 text-sm font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
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
