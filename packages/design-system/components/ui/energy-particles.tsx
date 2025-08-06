"use client"

import React from "react"
import { cn } from "@repo/design-system/lib/utils"

interface EnergyParticlesProps {
  className?: string
  particleCount?: number
}

export function EnergyParticles({ className, particleCount = 5 }: EnergyParticlesProps) {
  return (
    <div className={cn("absolute inset-0", className)}>
      {Array.from({ length: particleCount }).map((_, index) => (
        <div
          key={index}
          className="particle absolute w-1 h-1 rounded-full bg-primary"
          style={{
            top: `${20 + (index * 15)}%`,
            left: `${10 + (index * 18)}%`,
            animationDelay: `${index * 0.5}s`,
            filter: 'drop-shadow(0 0 5px var(--jolteon-primary, #FFD60A))',
          }}
        />
      ))}
      <style jsx>{`
        .particle {
          animation: particle-float 4s ease-in-out infinite;
        }

        @keyframes particle-float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          50% {
            transform: translateY(-50px) scale(1.5);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}