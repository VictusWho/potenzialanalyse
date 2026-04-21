"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BeamPath {
  path: string;
  gradientConfig: {
    initial: {
      x1: string;
      x2: string;
      y1: string;
      y2: string;
    };
    animate: {
      x1: string | string[];
      x2: string | string[];
      y1: string | string[];
      y2: string | string[];
    };
    transition?: {
      duration?: number;
      repeat?: number;
      repeatType?: "loop" | "reverse" | "mirror";
      ease?: string;
      repeatDelay?: number;
      delay?: number;
    };
  };
  connectionPoints?: Array<{
    cx: number;
    cy: number;
    r: number;
  }>;
  gradientDirection?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}

interface GradientColorSet {
  start: string;
  middle: string;
  end: string;
}

interface PulseBeamsProps {
  children?: React.ReactNode;
  className?: string;
  background?: React.ReactNode;
  beams: BeamPath[];
  width?: number;
  height?: number;
  baseColor?: string;
  accentColor?: string;
  gradientColors?: GradientColorSet;
}

export const PulseBeams = ({
  children,
  className,
  background,
  beams,
  width = 858,
  height = 434,
  baseColor = "var(--slate-800)",
  accentColor = "var(--slate-600)",
  gradientColors,
}: PulseBeamsProps) => {
  return (
    <div
      className={cn(
        "w-full h-screen relative flex items-center justify-center antialiased overflow-hidden",
        className
      )}
    >
      {background}
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <SVGs
          beams={beams}
          width={width}
          height={height}
          baseColor={baseColor}
          accentColor={accentColor}
          gradientColors={gradientColors}
        />
      </div>
    </div>
  );
};

interface SVGsProps {
  beams: BeamPath[];
  width: number;
  height: number;
  baseColor: string;
  accentColor: string;
  gradientColors?: GradientColorSet;
}

const DASH_LENGTH = 60;
const GAP_LENGTH = 900;
const CYCLE = DASH_LENGTH + GAP_LENGTH;

const SVGs = ({ beams, width, height, baseColor, accentColor }: SVGsProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex flex-shrink-0"
    >
      <defs>
        {beams.map((beam, index) => {
          const dir = beam.gradientDirection ?? { x1: 0, y1: 0, x2: 1, y2: 1 };
          return (
            <linearGradient
              key={index}
              id={`pulseBeamGrad${index}`}
              gradientUnits="objectBoundingBox"
              x1={dir.x1}
              y1={dir.y1}
              x2={dir.x2}
              y2={dir.y2}
            >
              <stop offset="0%" stopColor="#6D28D9" />
              <stop offset="25%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="75%" stopColor="#D946EF" />
              <stop offset="100%" stopColor="#F0ABFC" />
            </linearGradient>
          );
        })}
      </defs>
      {beams.map((beam, index) => {
        const t = beam.gradientConfig.transition ?? {};
        return (
          <React.Fragment key={index}>
            <path d={beam.path} stroke={baseColor} strokeWidth="1" />
            <motion.path
              d={beam.path}
              stroke={`url(#pulseBeamGrad${index})`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${DASH_LENGTH} ${GAP_LENGTH}`}
              initial={{ strokeDashoffset: -CYCLE }}
              animate={{ strokeDashoffset: 0 }}
              transition={{
                duration: t.duration ?? 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: t.ease ?? "linear",
                repeatDelay: t.repeatDelay ?? 0,
                delay: t.delay ?? 0,
              }}
            />
            {beam.connectionPoints?.map((point, pointIndex) => (
              <circle
                key={`${index}-${pointIndex}`}
                cx={point.cx}
                cy={point.cy}
                r={point.r}
                fill={baseColor}
                stroke={accentColor}
              />
            ))}
          </React.Fragment>
        );
      })}
    </svg>
  );
};
