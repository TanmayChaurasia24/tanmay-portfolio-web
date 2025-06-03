
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ThemeToggle from './ThemeToggle';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll event to change navbar styling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-2 bg-white/80 dark:bg-gray-900/80 shadow backdrop-blur-lg' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="container max-w-6xl mx-auto px-4 flex justify-between items-center">
        <a href="#home" className="text-xl md:text-2xl font-bold solana-gradient-text">
          Tanmay Kumar
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Theme Toggle and Mobile Menu */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 mt-10">
                  {navLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link.href)}
                      className="py-2 px-4 text-left text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                    >
                      {link.name}
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
