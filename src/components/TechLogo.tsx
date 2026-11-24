import React from "react";
import {
  IconBrandReact,
  IconBrandNextjs,
  IconBrandTypescript,
  IconBrandJavascript,
  IconBrandTailwind,
  IconBrandThreejs,
  IconBrandNodejs,
  IconBrandGolang,
  IconBrandMongodb,
  IconBrandPrisma,
  IconBrandFirebase,
  IconBrandReactNative,
  IconBrandApple,
  IconBrandAndroid,
  IconBrandDocker,
  IconBrandAws,
} from "@tabler/icons-react";

interface TechLogoProps {
  name: string;
  className?: string;
  size?: number;
}

export const TechLogo: React.FC<TechLogoProps> = ({
  name,
  className = "h-4 w-4 shrink-0",
  size = 16,
}) => {
  const norm = name.trim().toLowerCase();

  // Tabler brand icons
  if (norm === "react") {
    return <IconBrandReact size={size} className={className} style={{ color: "#00D8FF" }} />;
  }
  if (norm === "next.js" || norm === "nextjs") {
    return <IconBrandNextjs size={size} className={className} />;
  }
  if (norm === "typescript") {
    return <IconBrandTypescript size={size} className={className} style={{ color: "#3178C6" }} />;
  }
  if (norm === "javascript") {
    return <IconBrandJavascript size={size} className={className} style={{ color: "#F7DF1E" }} />;
  }
  if (norm === "tailwind css" || norm === "tailwind") {
    return <IconBrandTailwind size={size} className={className} style={{ color: "#38BDF8" }} />;
  }
  if (norm === "three.js" || norm === "threejs") {
    return <IconBrandThreejs size={size} className={className} />;
  }
  if (norm === "node.js" || norm === "nodejs") {
    return <IconBrandNodejs size={size} className={className} style={{ color: "#5FA04E" }} />;
  }
  if (norm === "golang" || norm === "go") {
    return <IconBrandGolang size={size} className={className} style={{ color: "#00ADD8" }} />;
  }
  if (norm === "mongodb") {
    return <IconBrandMongodb size={size} className={className} style={{ color: "#47A248" }} />;
  }
  if (norm === "prisma") {
    return <IconBrandPrisma size={size} className={className} style={{ color: "#5A67D8" }} />;
  }
  if (norm === "firebase") {
    return <IconBrandFirebase size={size} className={className} style={{ color: "#FFCA28" }} />;
  }
  if (norm === "react native") {
    return <IconBrandReactNative size={size} className={className} style={{ color: "#61DAFB" }} />;
  }
  if (norm === "ios" || norm === "apple") {
    return <IconBrandApple size={size} className={className} />;
  }
  if (norm === "android") {
    return <IconBrandAndroid size={size} className={className} style={{ color: "#3DDC84" }} />;
  }
  if (norm === "docker") {
    return <IconBrandDocker size={size} className={className} style={{ color: "#2496ED" }} />;
  }
  if (norm === "aws") {
    return <IconBrandAws size={size} className={className} style={{ color: "#FF9900" }} />;
  }

  // Custom official SVG icons for tools without direct Tabler brand icons
  if (norm === "postgresql" || norm === "postgres") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M12 2C7.5 2 3.8 5.4 3.4 9.8c-.4 4.1 2.2 7.7 6.1 8.8v2.9c0 .3.2.5.5.5h4c.3 0 .5-.2.5-.5v-2.9c3.9-1.1 6.5-4.7 6.1-8.8C19.8 5.4 16.5 2 12 2z"
          fill="#336791"
        />
        <circle cx="9" cy="9" r="1.5" fill="#FFFFFF" />
        <circle cx="15" cy="9" r="1.5" fill="#FFFFFF" />
        <path
          d="M9.5 13.5c1.5 1 3.5 1 5 0"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (norm === "n8n") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect x="2" y="5" width="6" height="6" rx="2" fill="#EA4B71" />
        <rect x="16" y="5" width="6" height="6" rx="2" fill="#FF6D5A" />
        <rect x="9" y="13" width="6" height="6" rx="2" fill="#EA4B71" />
        <path d="M8 8h8M12 8v5M5 11v5h4" stroke="#EA4B71" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (norm === "express") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <text
          x="2"
          y="17"
          fontFamily="system-ui, sans-serif"
          fontSize="14"
          fontWeight="700"
          letterSpacing="-1"
        >
          ex
        </text>
      </svg>
    );
  }

  if (norm === "gsap") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="12" cy="12" r="10" fill="#0AE448" fillOpacity="0.15" />
        <circle cx="12" cy="12" r="10" stroke="#0AE448" strokeWidth="1.5" />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fill="#0AE448"
          fontFamily="system-ui, sans-serif"
          fontSize="10"
          fontWeight="800"
        >
          G
        </text>
      </svg>
    );
  }

  if (norm === "kafka") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="6" cy="12" r="3" fill="#E535AB" />
        <circle cx="18" cy="6" r="3" fill="#E535AB" />
        <circle cx="18" cy="18" r="3" fill="#E535AB" />
        <path d="M6 12L18 6M6 12L18 18" stroke="#E535AB" strokeWidth="1.8" />
      </svg>
    );
  }

  if (norm === "nginx") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <polygon points="12,2 22,7.8 22,16.2 12,22 2,16.2 2,7.8" fill="#009639" />
        <path
          d="M8 16V8L16 16V8"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (norm === "jenkins") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="12" cy="12" r="9" fill="#D33833" />
        <path d="M12 6a3 3 0 0 0-3 3v2h6V9a3 3 0 0 0-3-3z" fill="#FFFFFF" />
        <path d="M8 15h8v3H8z" fill="#FFFFFF" />
        <path d="M10 11h4v3h-4z" fill="#335061" />
      </svg>
    );
  }

  if (norm === "expo") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path d="M2 18.5L9.5 4.5h5L7 18.5H2zm7.5 0L17 4.5h5L14.5 18.5h-5z" />
      </svg>
    );
  }

  if (norm === "rag") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect x="3" y="3" width="7" height="7" rx="2" fill="#06B6D4" fillOpacity="0.8" />
        <rect x="14" y="3" width="7" height="7" rx="2" fill="#3B82F6" fillOpacity="0.8" />
        <rect x="8.5" y="14" width="7" height="7" rx="2" fill="#10B981" fillOpacity="0.8" />
        <path d="M6.5 10v2a2 2 0 0 0 2 2h3.5m5.5-4v2a2 2 0 0 1-2 2h-3.5" stroke="#38BDF8" strokeWidth="1.5" />
      </svg>
    );
  }

  if (norm === "ai agents" || norm === "ai agent") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect x="4" y="5" width="16" height="14" rx="4" fill="#6366F1" fillOpacity="0.2" stroke="#6366F1" strokeWidth="1.6" />
        <circle cx="9" cy="11" r="1.5" fill="#6366F1" />
        <circle cx="15" cy="11" r="1.5" fill="#6366F1" />
        <path d="M12 2v3M9 15c1 1 5 1 6 0" stroke="#6366F1" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (norm === "ai api integrations" || norm === "api integrations") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="12" cy="12" r="4" fill="#A855F7" fillOpacity="0.4" stroke="#A855F7" strokeWidth="1.5" />
        <path d="M12 2v6M12 16v6M2 12h6M16 12h6" stroke="#A855F7" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (norm === "workflow automation") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
          fill="#F59E0B"
          fillOpacity="0.8"
          stroke="#F59E0B"
          strokeWidth="1.2"
        />
      </svg>
    );
  }

  if (norm === "ci/cd" || norm === "cicd") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M7 8a4 4 0 1 0 0 8c3 0 4-8 8-8a4 4 0 1 1 0 8c-3 0-4-8-8-8z"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (norm === "pub/sub" || norm === "pubsub") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="6" cy="6" r="3" fill="#4285F4" />
        <circle cx="18" cy="12" r="3" fill="#4285F4" />
        <circle cx="6" cy="18" r="3" fill="#4285F4" />
        <path d="M9 7.5l6 3M9 16.5l6-3" stroke="#4285F4" strokeWidth="1.5" />
      </svg>
    );
  }

  if (norm === "message queues") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect x="3" y="6" width="4" height="12" rx="1" fill="#818CF8" />
        <rect x="10" y="6" width="4" height="12" rx="1" fill="#818CF8" fillOpacity="0.7" />
        <rect x="17" y="6" width="4" height="12" rx="1" fill="#818CF8" fillOpacity="0.4" />
      </svg>
    );
  }

  if (norm === "mongoose") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="12" cy="12" r="9" fill="#E53E3E" fillOpacity="0.2" stroke="#E53E3E" strokeWidth="1.6" />
        <path
          d="M8 14c1.5 2 6.5 2 8 0M9 10h.01M15 10h.01"
          stroke="#E53E3E"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Fallback generic tech icon
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="12 8 8 12 12 16 16 12 12 8" />
    </svg>
  );
};
