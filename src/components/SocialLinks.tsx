
import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import portfolioData from '../data/portfolio.json';

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
};

const SocialLinks = () => {
  return (
    <div className="flex justify-center items-center gap-3">
      {portfolioData.social.map((social, index) => {
        const IconComponent = iconMap[social.icon as keyof typeof iconMap];
        
        return (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            aria-label={social.icon}
          >
            <IconComponent className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
