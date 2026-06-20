"use client";

import { useMemo } from "react";

interface ConfettiBurstProps {
  trigger: boolean;
}

interface Dot {
  id: number;
  left: string;
  color: string;
  delay: string;
  borderRadius: string;
}

const COLORS = ["#FF85A2", "#76E4F7", "#FFE082", "#b5213e"];
const COUNT = 30;

function generateDots(): Dot[] {
  return Array.from({ length: COUNT }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}vw`,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
    delay: `${(Math.random() * 2).toFixed(2)}s`,
    borderRadius: Math.random() > 0.5 ? "50%" : "0%",
  }));
}

export function ConfettiBurst({ trigger }: ConfettiBurstProps) {
  // Stable per mount — only recalculated when component is re-mounted
  const dots = useMemo(() => generateDots(), []);

  if (!trigger) return null;

  return (
    <>
      {dots.map((dot) => (
        <div
          key={dot.id}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: dot.left,
            width: 10,
            height: 10,
            backgroundColor: dot.color,
            borderRadius: dot.borderRadius,
            opacity: 0.8,
            pointerEvents: "none",
            zIndex: 100,
            animation: `confetti-fall 3s linear ${dot.delay} forwards`,
          }}
        />
      ))}
    </>
  );
}
