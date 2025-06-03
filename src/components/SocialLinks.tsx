
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
    <div className="flex justify-center space-x-6">
      {portfolioData.social.map((social, index) => {
        const IconComponent = iconMap[social.icon as keyof typeof iconMap];
        
        return (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full glass-card hover:scale-110 transition-transform duration-300 group"
          >
            <IconComponent className="h-6 w-6 text-gray-600 group-hover:text-purple-600 transition-colors" />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
