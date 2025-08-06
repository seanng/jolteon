"use client"

import React from "react"
import { cn } from "@repo/design-system/lib/utils"

interface LightningBoltProps {
  className?: string
  width?: number
  height?: number
}

export function LightningBolt({ className, width = 600, height = 300 }: LightningBoltProps) {
  return (
    <div className={cn("relative", className)} style={{ width, height }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <defs>
          <filter id="lightning-glow">
            <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path
          className="lightning-path"
          d="M100,50 L200,100 L180,150 L280,120 L260,180 L360,140 L340,220 L440,170 L420,250 L500,200"
          fill="none"
          stroke="var(--jolteon-primary, #FFD60A)"
          strokeWidth="4"
          filter="url(#lightning-glow)"
        />
      </svg>
      <style jsx>{`
        .lightning-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: lightning-strike 3s ease-in-out infinite;
        }

        @keyframes lightning-strike {
          0% {
            stroke-dashoffset: 1000;
            opacity: 0;
          }
          10% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          15% {
            stroke-dashoffset: 0;
            opacity: 0.5;
          }
          20% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          25% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
          100% {
            stroke-dashoffset: 1000;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}