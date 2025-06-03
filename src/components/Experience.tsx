
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import portfolioData from '../data/portfolio.json';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      const experienceItems = experienceRef.current?.children;
      if (experienceItems) {
        gsap.fromTo(experienceItems,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: experienceRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-center mb-16 solana-gradient-text"
        >
          Experience & Education
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Work Experience */}
          <div>
            <h3 className="text-2xl font-semibold mb-8 text-center">Work Experience</h3>
            
            <div ref={experienceRef} className="space-y-6">
              {portfolioData.experience.map((job, index) => (
                <Card key={index} className="glass-card border-0 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {job.position}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-purple-600">{job.company}</span>
                      <span className="text-sm text-gray-500">{job.duration}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">{job.location}</span>
                    </div>
                    
                    <p className="text-gray-700">{job.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Education */}
          <div>
            <h3 className="text-2xl font-semibold mb-8 text-center">Education</h3>
            
            <div className="space-y-6">
              {portfolioData.education.map((edu, index) => (
                <Card key={index} className="glass-card border-0 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {edu.degree} in {edu.field}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-purple-600">{edu.school}</span>
                      <span className="text-sm text-gray-500">{edu.year}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">{edu.location}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Certifications or Additional Learning */}
            <div className="mt-10">
              <Card className="glass-card border-0 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">
                    Currently Learning
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-purple-600">Solana Development</h4>
                      <p className="text-gray-700">Learning Rust and Anchor framework for building dApps on Solana</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-purple-600">Web3 & Blockchain</h4>
                      <p className="text-gray-700">Exploring decentralized applications and smart contract development</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
