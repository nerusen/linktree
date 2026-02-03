import { cn } from "@/lib/utils"

export interface GridPatternProps {
  squares?: Array<[number, number]>
  className?: string
}

export function GridPattern({
  squares = [],
  className,
}: GridPatternProps) {
  const groupedSquares = new Map<string, number>()

  squares.forEach(([x, y]) => {
    const key = `${x},${y}`
    groupedSquares.set(key, (groupedSquares.get(key) ?? 0) + 1)
  })

  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1024 1024"
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
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      {Array.from(groupedSquares.entries()).map(([key, count]) => {
        const [x, y] = key.split(",").map(Number)
        return (
          <rect
            key={key}
            x={x * 40}
            y={y * 40}
            width="40"
            height="40"
            fill="currentColor"
            fillOpacity={0.15 * count}
          />
        )
      })}
    </svg>
  )
}
