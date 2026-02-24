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
    return <div className="w-full h-80 bg-secondary/50 rounded-lg animate-pulse" />
  }

  const maxVotes = Math.max(...products.map(p => p.vote_count), 1)

  return (
    <div className="w-full space-y-6">
      {products.map((product) => {
        const percentage = (product.vote_count / maxVotes) * 100
        
        return (
          <div key={product.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground truncate flex-1">
                {product.title}
              </span>
              <span className="text-xs font-bold text-accent ml-2 whitespace-nowrap">
                {product.vote_count} votes
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full overflow-hidden h-8 relative">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-3"
                style={{ width: `${percentage}%` }}
              >
                {percentage > 10 && (
                  <span className="text-xs font-bold text-accent-foreground">
                    {Math.round(percentage)}%
                  </span>
                )}
              </div>
              {percentage <= 10 && percentage > 0 && (
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-bold text-accent">
                  {Math.round(percentage)}%
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
