"use client"

import React from "react"
import { cn } from "@repo/design-system/lib/utils"

interface JolteonLogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function JolteonLogo({ className, showText = true, size = "md" }: JolteonLogoProps) {
  const sizes = {
    sm: { icon: "w-10 h-10", text: "text-2xl" },
    md: { icon: "w-[50px] h-[50px]", text: "text-4xl" },
    lg: { icon: "w-16 h-16", text: "text-5xl" }
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className={cn(
        "bg-primary rounded-[15px] flex items-center justify-center text-[30px] animate-zap",
        sizes[size].icon
      )}>
        ⚡
      </div>
      {showText && (
        <span className={cn(
          "text-white uppercase tracking-[2px]",
          sizes[size].text
        )} style={{ fontFamily: 'Jaro, sans-serif' }}>
          JOLTEON
        </span>
      )}
      <style jsx>{`
        @keyframes zap {
          0%, 100% {
            transform: rotateZ(0deg) scale(1);
          }
          25% {
            transform: rotateZ(-5deg) scale(1.05);
          }
          50% {
            transform: rotateZ(5deg) scale(1.1);
          }
          75% {
            transform: rotateZ(-2deg) scale(1.05);
          }
        }
        
        .animate-zap {
          animation: zap 3s ease-in-out infinite;
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  )
}