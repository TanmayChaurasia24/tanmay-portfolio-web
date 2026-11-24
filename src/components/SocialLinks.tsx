
import React from 'react';
import { Mail, Calendar } from 'lucide-react';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandInstagram,
} from '@tabler/icons-react';
import portfolioData from '../data/portfolio.json';

const DevToIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 448 512" className={className} fill="currentColor">
    <path d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.54h17.45c3.88 0 7.77-1.45 11.65-4.35s5.82-7.25 5.82-13.06v-69.72c-.01-5.8-1.96-10.15-5.83-13.06zM404.1 32H43.9C19.7 32 .06 51.69 0 75.8v360.4C.06 460.31 19.7 480 43.9 480h360.2c24.21 0 43.84-19.69 43.9-43.8V75.8c-.06-24.11-19.69-43.8-43.9-43.8zM154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.38 28.49 47.38 47.25v70.96zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16 0-20.58-9.42-20.58-20.58V193.55c0-11.16 9.42-20.58 20.58-20.58h62.18v29.56zm100.55 137.93l-28.53-73.66-28.53 73.66h-32.96l41.6-107.31-41.6-107.3h33.22l28.27 73.41 28.27-73.41h33.22l-41.6 107.3 41.6 107.31h-33.08z" />
  </svg>
);

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: IconBrandGithub,
  linkedin: IconBrandLinkedin,
  twitter: IconBrandX,
  instagram: IconBrandInstagram,
  devto: DevToIcon,
  calendar: Calendar,
  mail: Mail,
};

const SocialLinks = () => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-2.5">
      {portfolioData.social.map((social, index) => {
        const IconComponent = iconMap[social.icon] || Mail;

        return (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-2.5 sm:p-3 rounded-xl bg-card/80 border border-border/70 hover:border-primary/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
            aria-label={social.name}
            title={social.name}
          >
            <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
