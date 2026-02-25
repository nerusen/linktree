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
  isTopVoted?: boolean
}

export default function ProductCard({
  product,
  hasVoted,
  onVote,
  isTopVoted = false,
}: ProductCardProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [showBloom, setShowBloom] = useState(false)

  const handleVote = async () => {
    if (hasVoted || isVoting) return
    setShowBloom(true)
    setIsVoting(true)
    try {
      await onVote()
    } catch (error) {
      console.error('Vote error:', error)
    } finally {
      setIsVoting(false)
      setTimeout(() => setShowBloom(false), 600)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Product Image Container */}
      <div className="relative w-full aspect-square mb-3 rounded-2xl overflow-hidden bg-secondary border border-foreground/10">
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          crossOrigin="anonymous"
        />
        
        {/* Terpilih Badge - Green with border */}
        {isTopVoted && (
          <div className="absolute top-2 right-2 z-10 bg-green-600 text-white px-2 py-1 rounded-md text-xs font-bold border border-green-400">
            Terpilih
          </div>
        )}
      </div>

      {/* Product Title */}
      <h3 className="text-xs font-medium text-foreground/80 mb-2 line-clamp-2 h-7">
        {product.title}
      </h3>

      {/* Vote Button with Bloom Effect */}
      <button
        onClick={handleVote}
        disabled={hasVoted || isVoting}
        className={`relative w-full py-2 px-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
          hasVoted
            ? 'bg-foreground/10 text-foreground/70 cursor-default'
            : 'bg-foreground text-background hover:shadow-lg'
        } ${showBloom ? 'animate-bloom' : ''}`}
      >
        <span>{hasVoted ? '✓' : 'Vote'}</span>
        <span className="font-bold text-xs bg-white/20 px-1.5 py-0.5 rounded">
          {product.vote_count}
        </span>
      </button>
    </div>
  )
}
