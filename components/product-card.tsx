'use client'

import Image from 'next/image'
import { useState } from 'react'

interface Product {
  id: string
  title: string
  image_url: string
  order: number
  vote_count: number
}

interface ProductCardProps {
  product: Product
  hasVoted: boolean
  onVote: () => void
}

export default function ProductCard({
  product,
  hasVoted,
  onVote,
}: ProductCardProps) {
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async () => {
    if (hasVoted || isVoting) return
    setIsVoting(true)
    try {
      await onVote()
    } catch (error) {
      console.error('Vote error:', error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="group flex flex-col h-full">
      {/* Product Image Container - Rounded corners matching LinkButton design */}
      <div className="relative w-full aspect-square mb-4 rounded-3xl overflow-hidden bg-card border border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          crossOrigin="anonymous"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        {/* Vote Button */}
        <button
          onClick={handleVote}
          disabled={hasVoted || isVoting}
          className={`w-full py-2.5 px-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm ${
            hasVoted
              ? 'bg-secondary/50 text-secondary-foreground cursor-default border border-border'
              : 'bg-accent text-accent-foreground hover:bg-accent/90 active:scale-95'
          } ${isVoting ? 'opacity-70 cursor-wait' : ''}`}
        >
          <span>Vote</span>
          <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md text-xs">
            {product.vote_count}
          </span>
        </button>

        {hasVoted && (
          <p className="text-xs text-muted-foreground mt-2 text-center font-medium">
            ✓ Already voted
          </p>
        )}
      </div>
    </div>
  )
}
