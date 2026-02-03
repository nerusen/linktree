import React from "react"
import { cn } from "@/lib/utils"

interface AnimatedGridPatternProps {
  numSquares?: number
  maxOpacity?: number
  duration?: number
  repeatDelay?: number
  className?: string
}

export function AnimatedGridPattern({
  numSquares = 30,
  maxOpacity = 0.1,
  duration = 3,
  repeatDelay = 1,
  className,
}: AnimatedGridPatternProps) {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity={maxOpacity}
          />
        </pattern>

        <style>{`
          @keyframes grid-animation {
            0% {
              opacity: ${maxOpacity};
            }
            50% {
              opacity: ${maxOpacity * 2};
            }
            100% {
              opacity: ${maxOpacity};
            }
          }

          .animated-grid-square {
            animation: grid-animation ${duration}s ease-in-out infinite;
            animation-delay: var(--delay);
          }
        `}</style>
      </defs>

      <rect width="100%" height="100%" fill="url(#grid-pattern)" />

      {Array.from({ length: numSquares }).map((_, i) => {
        const x = Math.random() * 100
        const y = Math.random() * 100
        const delay = (i * (duration + repeatDelay)) / numSquares

        return (
          <rect
            key={i}
            x={`${x}%`}
            y={`${y}%`}
            width="40"
            height="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity={maxOpacity}
            className="animated-grid-square"
            style={{ "--delay": `${delay}s` } as React.CSSProperties}
          />
        )
      })}
    </svg>
  )
}
