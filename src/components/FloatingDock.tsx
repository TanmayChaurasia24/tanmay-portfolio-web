import React, { useState, useEffect } from "react";
import { Terminal, Moon, Sun, Sparkles, Menu, X, ArrowUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface FloatingDockProps {
  onOpenMenu: () => void;
}

const FloatingDock: React.FC<FloatingDockProps> = ({ onOpenMenu }) => {
  const { theme, toggleTheme } = useTheme();
  const [mode, setMode] = useState<"site" | "story">("site");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 2.8;
      setVisible(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`transition-all duration-300 ${
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Floating Bottom Center Dock */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 select-none">
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-background/85 dark:bg-card/90 backdrop-blur-xl border border-border/70 shadow-2xl text-xs font-mono text-foreground/80">
          {/* Code Icon */}
          <span className="px-2 text-muted-foreground font-semibold">
            &lt;/&gt;
          </span>

          {/* Mode Switcher */}
          <div className="flex items-center bg-muted/70 rounded-full p-0.5">
            <button
              onClick={() => {
                setMode("site");
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                mode === "site"
                  ? "bg-foreground text-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Work
            </button>
            <button
              onClick={() => {
                setMode("story");
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                mode === "story"
                  ? "bg-foreground text-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Story
            </button>
          </div>

          <div className="w-px h-3.5 bg-border/60 mx-0.5" />

          {/* Region Tag */}
          <span className="px-2 text-[11px] font-semibold text-foreground/80">
            IN · IST
          </span>

          <div className="w-px h-3.5 bg-border/60 mx-0.5" />

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
            title="Toggle light / dark mode"
          >
            {theme === "dark" ? (
              <Sun className="h-3.5 w-3.5 text-amber-400" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-indigo-500" />
            )}
          </button>
        </div>
      </div>

      {/* Floating Bottom Right Action Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={onOpenMenu}
          className="w-12 h-12 rounded-full bg-[#4f46e5] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
          aria-label="Toggle menu"
          title="Open Menu"
        >
          <div className="space-y-1">
            <div className="w-5 h-0.5 bg-white rounded-full" />
            <div className="w-5 h-0.5 bg-white rounded-full" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default FloatingDock;
