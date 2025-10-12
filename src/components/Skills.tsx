
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Server, 
  Blocks, 
  Wrench,
  Code,
  Database,
  Coins,
  GitBranch,
  Cloud,
  Palette
} from 'lucide-react';
import portfolioData from '../data/portfolio.json';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  // Icon mapping for categories
  const categoryIcons = {
    'Frontend': Monitor,
    'Backend': Server,
    'Blockchain': Blocks,
    'Tools': Wrench
  };

  // Icon mapping for individual skills
  const skillIcons: { [key: string]: React.ComponentType<any> } = {
    'React': Code,
    'Next.js': Code,
    'TypeScript': Code,
    'JavaScript': Code,
    'Tailwind CSS': Palette,
    'Node.js': Server,
    'Express': Server,
    'Python': Code,
    'PostgreSQL': Database,
    'MongoDB': Database,
    'Solana': Coins,
    'Web3.js': Coins,
    'Anchor Framework': Coins,
    'Rust': Code,
    'Smart Contracts': Coins,
    'Git': GitBranch,
    'Docker': Cloud,
    'AWS': Cloud,
    'Vercel': Cloud,
    'Figma': Palette
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      // Optimized title animation
      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );

      // Optimized skills cards animation
      const skillCards = skillsRef.current?.children;
      if (skillCards) {
        gsap.fromTo(skillCards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: skillsRef.current,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Expertise</span>
          <h2 
            ref={titleRef}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-4 solana-gradient-text"
          >
            Skills & Technologies
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Modern tech stack and tools I use to build exceptional digital experiences
          </p>
        </div>
        
        <div ref={skillsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {portfolioData.skills.map((skillCategory, index) => {
            const CategoryIcon = categoryIcons[skillCategory.category as keyof typeof categoryIcons] || Code;
            
            return (
              <Card key={index} className="glass-card group hover:border-primary/30 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-center mb-3 p-3 bg-primary/10 rounded-xl w-fit mx-auto group-hover:bg-primary/20 transition-colors">
                    <CategoryIcon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-bold text-center">
                    {skillCategory.category}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {skillCategory.items.map((skill, skillIndex) => {
                      const SkillIcon = skillIcons[skill] || Code;
                      
                      return (
                        <Badge 
                          key={skillIndex} 
                          variant="secondary" 
                          className="hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all cursor-default flex items-center gap-1.5 px-3 py-1"
                        >
                          <SkillIcon className="h-3 w-3" />
                          <span className="text-xs font-medium">{skill}</span>
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
