import React from "react";
import { Award, Code2, Sparkles, Terminal } from "lucide-react";

interface CircularStampProps {
  className?: string;
  text?: string;
}

const CircularStamp: React.FC<CircularStampProps> = ({
  className = "",
  text = "★ SOFTWARE ENGINEER ★ FULL-STACK & AI AUTOMATION ★ 2026 ",
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Rotating Text Ring */}
      <div className="w-44 h-44 sm:w-52 sm:h-52 animate-spin-slow">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <path
              id="stampCirclePath"
              d="M 100, 100 m -76, 0 a 76,76 0 1,1 152,0 a 76,76 0 1,1 -152,0"
            />
          </defs>

          {/* Dotted decorative track */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="3 4"
            className="text-foreground/25"
          />
          <circle
            cx="100"
            cy="100"
            r="64"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-foreground/15"
          />

          {/* Circular Text */}
          <text className="text-[10.5px] font-mono uppercase tracking-[0.24em] fill-foreground font-bold">
            <textPath href="#stampCirclePath" startOffset="0%">
              {text}
            </textPath>
          </text>
        </svg>
      </div>

      {/* Center Stippled Hub with Icon */}
      <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-foreground/20 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center shadow-lg p-2 text-center">
        <Terminal className="h-6 w-6 text-primary mb-1 animate-pulse" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-foreground">
          VERIFIED
        </span>
        <span className="text-[8px] font-mono text-muted-foreground">
          ENGINEER
        </span>
      </div>
    </div>
  );
};

export default CircularStamp;
