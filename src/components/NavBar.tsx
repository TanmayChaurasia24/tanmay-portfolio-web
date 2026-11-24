import React, { useState, useEffect } from "react";
import { ArrowRight, X, Sparkles, ExternalLink, Mail, Phone } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import portfolioData from "../data/portfolio.json";
import SocialLinks from "./SocialLinks";

interface NavBarProps {
  menuOpen?: boolean;
  setMenuOpen?: (open: boolean) => void;
}

const NavBar: React.FC<NavBarProps> = ({
  menuOpen: externalMenuOpen,
  setMenuOpen: setExternalMenuOpen,
}) => {
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const isMenuOpen = externalMenuOpen !== undefined ? externalMenuOpen : internalMenuOpen;
  const setMenuOpen = setExternalMenuOpen || setInternalMenuOpen;

  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Only show sticky navbar once user has scrolled past the 350vh ParticleHero section
      const threshold = window.innerHeight * 2.8;
      setScrolledPastHero(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-3 bg-background/85 dark:bg-[#101010]/90 backdrop-blur-xl border-b border-border/50 shadow-xs ${scrolledPastHero
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-full opacity-0 pointer-events-none"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Name and Title */}
          <div className="flex items-center gap-3 sm:gap-6">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#home");
              }}
              className="font-heading text-sm sm:text-base font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity flex items-center gap-1.5"
            >
              <span>{portfolioData.personal.name}</span>
              <span className="text-[#4f46e5] text-xs font-mono font-bold">••</span>
            </a>

            <div className="hidden md:block w-px h-3.5 bg-border/80" />

            <span className="hidden md:inline-block text-xs font-mono text-muted-foreground tracking-tight">
              Software Engineer · Full-Stack & AI Automation
            </span>
          </div>

          {/* Center: Open for freelance work badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs font-mono text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Open for freelance work</span>
          </div>

          {/* Right: Quick Links & Menu Pill */}
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden sm:flex items-center gap-5 text-xs font-medium text-muted-foreground">
              <button
                onClick={() => handleNavClick("#about")}
                className="hover:text-foreground transition-colors"
              >
                About
              </button>
              <button
                onClick={() => handleNavClick("#projects")}
                className="hover:text-foreground transition-colors"
              >
                Work
              </button>
              <button
                onClick={() => handleNavClick("#ai-automation")}
                className="hover:text-foreground transition-colors"
              >
                Automations
              </button>
              <button
                onClick={() => handleNavClick("#contact")}
                className="hover:text-foreground transition-colors"
              >
                Contact
              </button>
            </nav>

            {/* Menu •• pill button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="px-3.5 py-1.5 rounded-full border border-border/80 bg-background/80 hover:bg-muted text-xs font-mono font-semibold text-foreground flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <span>Menu</span>
              <span className="text-[#4f46e5] font-bold">••</span>
            </button>
          </div>
        </div>
      </header>

      {/* Full Menu Sheet */}
      <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-[320px] sm:w-[420px] p-6 sm:p-8 flex flex-col justify-between bg-card text-card-foreground">
          <div className="space-y-8 mt-4">
            <div className="border-b border-border/60 pb-5">
              <h3 className="font-heading text-xl font-bold text-foreground">
                {portfolioData.personal.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {portfolioData.personal.title}
              </p>
              <div className="inline-flex items-center gap-2 mt-3 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for projects</span>
              </div>
            </div>

            {/* Navigation Links with Index Numbers */}
            <nav className="space-y-1 font-heading">
              {[
                { number: "01", name: "Home", href: "#home" },
                { number: "02", name: "About Me", href: "#about" },
                { number: "03", name: "Featured Projects", href: "#projects" },
                { number: "04", name: "AI & Automations", href: "#ai-automation" },
                { number: "05", name: "Services", href: "#services" },
                { number: "06", name: "Skills", href: "#skills" },
                { number: "07", name: "Client Reviews", href: "#testimonials" },
                { number: "08", name: "Pricing & Scope", href: "#pricing" },
                { number: "09", name: "Contact & Booking", href: "#contact" },
              ].map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="w-full text-left py-2.5 px-3 rounded-lg flex items-center justify-between group hover:bg-muted transition-colors"
                >
                  <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground/60 group-hover:text-primary transition-colors">
                    ({item.number})
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-border/60 space-y-4">
            <Button
              onClick={() => handleNavClick("#contact")}
              className="w-full font-semibold gap-2 rounded-xl h-11 bg-[#4f46e5] hover:bg-[#4338ca] text-white"
            >
              <span>Let's Talk</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="flex justify-center pt-2">
              <SocialLinks />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default NavBar;
