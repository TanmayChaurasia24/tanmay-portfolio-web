
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
    <section ref={sectionRef} className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <h2 
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-center mb-16 solana-gradient-text"
        >
          Skills & Technologies
        </h2>
        
        <div ref={skillsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioData.skills.map((skillCategory, index) => {
            const CategoryIcon = categoryIcons[skillCategory.category as keyof typeof categoryIcons] || Code;
            
            return (
              <Card key={index} className="glass-card border-0 hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center justify-center mb-2">
                    <CategoryIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-center">
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
                          className="hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors cursor-default flex items-center gap-1"
                        >
                          <SkillIcon className="h-3 w-3" />
                          {skill}
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
