import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
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
    { name: 'Hackathons', href: '#hackathons' },
    { name: 'Freelance', href: '#freelance' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-3 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="container max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="font-heading text-xl md:text-2xl font-bold solana-gradient-text hover:opacity-80 transition-opacity">
          Tanmay Kumar
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-1">
            {navLinks.map((link) => (
              <li key={link.name}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200"
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
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col space-y-2 mt-10">
                  {navLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link.href)}
                      className="py-3 px-4 text-left text-base font-medium hover:bg-accent rounded-lg transition-colors"
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
