"use client"

import React from "react"
import { cn } from "@repo/design-system/lib/utils"

interface HeroBadgeProps {
  className?: string
  children: React.ReactNode
}

export function HeroBadge({ className, children }: HeroBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2.5 bg-primary/10 border-2 border-primary",
      "px-6 py-2.5 rounded-full mb-8 font-semibold text-sm uppercase tracking-[1px]",
      "animate-badge-pulse",
      className
    )}>
      <span className="w-2 h-2 bg-primary rounded-full animate-blink" />
      {children}
      <style jsx>{`
        @keyframes badge-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        .animate-badge-pulse {
          animation: badge-pulse 2s ease-in-out infinite;
        }

        .animate-blink {
          animation: blink 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}