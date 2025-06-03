
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
            className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5 text-purple-600" />
          </button>
        </div>
        
        <div className="text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Tanmay Kumar Chaurasia</h3>
          <p className="mb-6">Full Stack Developer • Solana Explorer</p>
          
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
