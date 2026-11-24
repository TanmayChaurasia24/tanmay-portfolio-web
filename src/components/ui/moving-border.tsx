"use client";
import React, { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface MovingBorderProps extends React.SVGAttributes<SVGSVGElement> {
  children: React.ReactNode;
  duration?: number;
  rx?: string | number;
  ry?: string | number;
  initialOffset?: number;
}

export const MovingBorder = ({
  children,
  duration = 3500,
  rx = 14,
  ry = 14,
  initialOffset = 0,
  className,
  ...otherProps
}: MovingBorderProps) => {
  const pathRef = useRef<SVGRectElement | null>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const length = pathRef.current?.getTotalLength();
    if (length && length > 0) {
      const pxPerMillisecond = length / duration;
      progress.set(((time + initialOffset) * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(progress, (val) => {
    try {
      return pathRef.current?.getPointAtLength(val)?.x ?? 0;
    } catch {
      return 0;
    }
  });

  const y = useTransform(progress, (val) => {
    try {
      return pathRef.current?.getPointAtLength(val)?.y ?? 0;
    } catch {
      return 0;
    }
  });

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={cn("absolute h-full w-full pointer-events-none", className)}
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
          pointerEvents: "none",
        }}
      >
        {children}
      </motion.div>
    </>
  );
};

export interface MovingBorderCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  borderRadius?: string;
  duration?: number;
  gradientClassName?: string;
  borderClassName?: string;
  containerClassName?: string;
  initialOffset?: number;
  beamSize?: number;
}

export const MovingBorderCard = React.forwardRef<
  HTMLDivElement,
  MovingBorderCardProps
>(
  (
    {
      children,
      className,
      containerClassName,
      duration = 4000,
      borderRadius = "0.75rem",
      gradientClassName,
      initialOffset = 0,
      beamSize = 130,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative p-[1.5px] overflow-hidden rounded-xl bg-border/40 group transition-all duration-300 hover:bg-border/60 hover:shadow-xl hover:shadow-primary/5",
          containerClassName
        )}
        style={{ borderRadius }}
        {...props}
      >
        {/* Animated Moving Border Track */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ borderRadius: `calc(${borderRadius} - 1.5px)` }}
        >
          <MovingBorder
            duration={duration}
            rx={12}
            ry={12}
            initialOffset={initialOffset}
          >
            <div
              style={{
                width: `${beamSize}px`,
                height: `${beamSize}px`,
              }}
              className={cn(
                "opacity-75 group-hover:opacity-100 transition-opacity blur-[2px]",
                "bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.95)_0%,rgba(56,189,248,0.75)_35%,rgba(168,85,247,0.4)_65%,transparent_80%)]",
                gradientClassName
              )}
            />
          </MovingBorder>
        </div>

        {/* Card Content Interior */}
        <div
          className={cn(
            "relative z-10 w-full h-full bg-card rounded-[calc(0.75rem-1.5px)] flex flex-col justify-between overflow-hidden",
            className
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

MovingBorderCard.displayName = "MovingBorderCard";
