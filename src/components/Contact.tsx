
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, MessageCircle, Calendar } from 'lucide-react';
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
    <section id="contact" ref={sectionRef} className="py-20 sm:py-24 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Let's Talk</span>
          <h2 
            ref={titleRef}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-3 mb-4 solana-gradient-text"
          >
            Get a Free Quote
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project idea? Reach out and I'll get back to you within 24 hours with a free estimate.
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
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Phone / WhatsApp</p>
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

          {/* Social Links, Calendar & Message */}
          <div className="space-y-6">
            {/* Calendar Booking Card */}
            <Card className="glass-card border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-primary" />
                  Book a Discovery Call
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 mb-6 leading-relaxed text-sm sm:text-base">
                  Ready to discuss your project? Pick a convenient time on my calendar for a free 30-minute discovery consultation.
                </p>
                <Button size="lg" className="w-full professional-gradient text-white font-semibold h-12 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" asChild>
                  <a href={portfolioData.personal.calendarUrl} target="_blank" rel="noopener noreferrer">
                    <Calendar className="h-5 w-5 mr-2" />
                    Schedule on Cal.com
                  </a>
                </Button>
              </CardContent>
            </Card>

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
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Quick Response Guaranteed</p>
                    <p className="text-sm text-muted-foreground">I typically respond within 2-4 hours during business hours.</p>
                  </div>
                </div>
                <p className="text-foreground/80 mb-4 leading-relaxed">
                  Whether you need a landing page, a full web app, or a mobile app — drop me a message with your idea and budget, and I'll get back to you with a detailed proposal.
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
