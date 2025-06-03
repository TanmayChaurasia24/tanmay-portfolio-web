
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';
import portfolioData from '../data/portfolio.json';
import SocialLinks from './SocialLinks';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

      const children = contentRef.current?.children;
      if (children) {
        gsap.fromTo(children,
          { opacity: 0, y: 70 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
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
    <section id="contact" ref={sectionRef} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-center mb-16 solana-gradient-text"
        >
          Get In Touch
        </h2>

        <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <Card className="glass-card border-0 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Send me a message</CardTitle>
            </CardHeader>
            
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Input placeholder="Your Name" className="focus:ring-purple-500 focus:border-purple-500" />
                </div>
                
                <div className="space-y-2">
                  <Input type="email" placeholder="Your Email" className="focus:ring-purple-500 focus:border-purple-500" />
                </div>
                
                <div className="space-y-2">
                  <Input placeholder="Subject" className="focus:ring-purple-500 focus:border-purple-500" />
                </div>
                
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Your Message" 
                    rows={5}
                    className="focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <Button type="submit" className="w-full solana-gradient text-white hover:opacity-90 transition-opacity">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-600">Email</p>
                    <a 
                      href={`mailto:${portfolioData.personal.email}`}
                      className="text-gray-900 hover:text-purple-600 transition-colors"
                    >
                      {portfolioData.personal.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Phone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-600">Phone</p>
                    <a 
                      href={`tel:${portfolioData.personal.phone}`}
                      className="text-gray-900 hover:text-purple-600 transition-colors"
                    >
                      {portfolioData.personal.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-600">Location</p>
                    <p className="text-gray-900">{portfolioData.personal.location}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-6">Connect With Me</h3>
              <SocialLinks />
            </div>
            
            <Card className="glass-card border-0 hover:shadow-lg transition-shadow duration-300 p-6">
              <p className="text-gray-700 mb-4">
                I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
              <p className="text-gray-900 font-medium">Let's build something amazing together!</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
