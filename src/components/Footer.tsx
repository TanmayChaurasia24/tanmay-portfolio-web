import React from "react";
import { ArrowUp, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialLinks from "./SocialLinks";
import portfolioData from "../data/portfolio.json";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = portfolioData.navLinks;

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-border/60 bg-card/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-border/40">
          <div>
            <h3 className="font-heading text-xl font-bold text-foreground">
              {portfolioData.personal.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {portfolioData.personal.title}
            </p>
          </div>

          {/* Quick Nav Links */}
          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </button>
            ))}
          </nav>

          <Button
            variant="outline"
            size="icon"
            onClick={scrollToTop}
            className="h-9 w-9 shrink-0 ml-auto md:ml-0"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Tanmay Kumar. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
