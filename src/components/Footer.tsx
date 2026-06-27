import React from 'react';
import { ArrowUp, Calendar } from 'lucide-react';
import SocialLinks from './SocialLinks';
import portfolioData from '../data/portfolio.json';

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
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 mt-6">
            <a
              href={portfolioData.personal.calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-950 font-semibold rounded-xl shadow-lg hover:bg-white/90 transition-all duration-200 hover:-translate-y-0.5 text-base"
            >
              <Calendar className="h-5 w-5 text-purple-700" />
              Book a Discovery Call
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200 hover:-translate-y-0.5 text-base"
            >
              Send a Message →
            </a>
          </div>
          
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
