import * as React from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  pauseOnHover?: boolean
  vertical?: boolean
  reverse?: boolean
}

const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  ({ className, reverse, pauseOnHover = false, vertical = false, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      className={cn(
        "group relative overflow-hidden",
        className
      )}
    >
      <style>{`
        @keyframes scroll {
          0% {
            transform: ${vertical ? "translateY(0)" : "translateX(0)"};
          }
          100% {
            transform: ${vertical ? `translateY(${reverse ? "-100%" : "100%"})` : `translateX(${reverse ? "100%" : "-100%"})`};
          }
        }
        .marquee-scroll {
          animation: scroll var(--duration, 20s) linear infinite;
          ${pauseOnHover ? "animation-play-state: running;" : ""}
        }
        .group:hover .marquee-scroll {
          ${pauseOnHover ? "animation-play-state: paused;" : ""}
        }
      `}</style>
      <div
        className={cn(
          "marquee-scroll flex",
          vertical ? "flex-col" : "flex-row",
          "[&_img]:max-w-none [&>div]:flex-shrink-0"
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "marquee-scroll absolute flex",
          vertical ? "flex-col" : "flex-row",
          vertical ? "top-0 left-0 h-full" : "top-0 left-0",
          "[&_img]:max-w-none [&>div]:flex-shrink-0"
        )}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  )
)

Marquee.displayName = "Marquee"

export { Marquee }
