
import React from 'react';
import { ArrowUp } from 'lucide-react';
import SocialLinks from './SocialLinks';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-10 px-4 solana-gradient">
      <div className="max-w-6xl mx-auto relative">
        <div className="absolute right-4 top-0">
          <button
            onClick={scrollToTop}
            className="p-3 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </button>
        </div>
        
        <div className="text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Tanmay Kumar Chaurasia</h3>
          <p className="mb-4 text-white/80">Freelance Web & Mobile App Developer</p>
          
          <p className="text-lg font-medium mb-6">
            Have a project in mind?{' '}
            <a href="#contact" className="underline underline-offset-4 hover:text-white/90 transition-colors">
              Let's work together →
            </a>
          </p>
          
          <div className="mb-8">
            <SocialLinks />
          </div>
          
          <div className="text-sm opacity-80">
            <p>© {new Date().getFullYear()} Tanmay Kumar Chaurasia. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
