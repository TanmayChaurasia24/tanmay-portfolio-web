
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import portfolioData from '../data/portfolio.json';
import SocialLinks from './SocialLinks';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
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

      const children = contentRef.current?.children;
      if (children) {
        gsap.fromTo(children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: contentRef.current,
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
    <section id="contact" ref={sectionRef} className="py-24 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Let's Connect</span>
          <h2 
            ref={titleRef}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-4 solana-gradient-text"
          >
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Let's discuss how I can help bring your ideas to life
          </p>
        </div>

        <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Contact Information</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Email</p>
                    <a 
                      href={`mailto:${portfolioData.personal.email}`}
                      className="text-foreground font-medium hover:text-primary transition-colors"
                    >
                      {portfolioData.personal.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Phone</p>
                    <a 
                      href={`tel:${portfolioData.personal.phone}`}
                      className="text-foreground font-medium hover:text-primary transition-colors"
                    >
                      {portfolioData.personal.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Location</p>
                    <p className="text-foreground font-medium">{portfolioData.personal.location}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links & Message */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Connect With Me</CardTitle>
              </CardHeader>
              <CardContent>
                <SocialLinks />
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="pt-6">
                <p className="text-foreground/80 mb-4 leading-relaxed">
                  I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                </p>
                <p className="text-foreground font-semibold text-lg">Let's build something amazing together!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
