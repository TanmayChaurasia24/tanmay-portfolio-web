import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhoneCall, PenTool, Code2, Rocket } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: PhoneCall,
    title: "Discovery Call",
    description:
      "We discuss your idea, business goals, target audience, and requirements. I'll give you an honest estimate of timeline and cost.",
    color: "from-blue-500 to-cyan-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: PenTool,
    title: "Design & Plan",
    description:
      "I create wireframes, choose the tech stack, and share a detailed roadmap. You review and approve before any code is written.",
    color: "from-violet-500 to-purple-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Code2,
    title: "Build & Iterate",
    description:
      "Development begins with regular updates. You see working previews and can request changes at any point — unlimited revisions.",
    color: "from-orange-500 to-amber-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: Rocket,
    title: "Launch & Support",
    description:
      "I deploy your app, run final QA, and handle store publishing if needed. Post-launch support and maintenance plans available.",
    color: "from-green-500 to-emerald-400",
    bg: "bg-green-500/10",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      const stepItems = stepsRef.current?.children;
      if (stepItems) {
        gsap.fromTo(
          stepItems,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: stepsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="py-20 sm:py-24 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            The Process
          </span>
          <h2
            ref={titleRef}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-3 mb-4 solana-gradient-text"
          >
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple, transparent process from idea to launch
          </p>
        </div>

        <div ref={stepsRef} className="relative">
          {/* Connector line - desktop only */}
          <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-px bg-border" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Icon container */}
                  <div className="relative mb-6">
                    <div className={`w-[68px] h-[68px] rounded-2xl ${step.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-4 ring-background`}>
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full professional-gradient flex items-center justify-center shadow-md">
                      <span className="text-[10px] font-bold text-white">
                        {index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-base sm:text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 professional-gradient text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-sm sm:text-base"
          >
            Start Your Project
            <Rocket className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
