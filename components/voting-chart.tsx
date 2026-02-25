'use client'

import { useEffect, useState } from 'react'

interface Product {
  id: string
  title: string
  vote_count: number
}

interface VotingChartProps {
  products: Product[]
}

export default function VotingChart({ products }: VotingChartProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="w-full h-20 bg-secondary/30 rounded-lg animate-pulse" />
  }

  const maxVotes = Math.max(...products.map(p => p.vote_count), 1)

  return (
    <div className="w-full space-y-4">
      {products.map((product) => {
        const percentage = (product.vote_count / maxVotes) * 100
        
        return (
          <div key={product.id} className="flex items-center gap-3">
            <span className="text-xs font-medium text-foreground/70 min-w-fit w-24 truncate">
              {product.title}
            </span>
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground/60 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-foreground/80 min-w-fit">
              {product.vote_count}
            </span>
          </div>
        )
      })}
    </div>
  )
}
