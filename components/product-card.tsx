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
    <div className="flex flex-col h-full group">
      {/* Product Image Container - Grid Design */}
      <div className="relative w-full aspect-square mb-4 rounded-3xl overflow-hidden bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/20 shadow-lg transition-all duration-500 group-hover:shadow-xl group-hover:border-foreground/30">
        {/* Image with smooth zoom */}
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          crossOrigin="anonymous"
        />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-100 group-hover:opacity-0 transition-opacity duration-700" />
        
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
        
        {/* Terpilih Badge - Green with glowing border */}
        {isTopVoted && (
          <div className="absolute top-3 right-3 z-10 bg-emerald-500/90 text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-300 shadow-lg backdrop-blur-sm">
            Terpilih
          </div>
        )}
      </div>

      {/* Product Title */}
      <h3 className="text-sm font-semibold text-foreground mb-4 line-clamp-2 min-h-9 transition-colors duration-300">
        {product.title}
      </h3>

      {/* Vote Button - Grid Design with Smooth Animation */}
      <button
        onClick={handleVote}
        disabled={hasVoted || isVoting}
        className={`relative mt-auto w-full py-3 px-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-500 flex items-center justify-center gap-2 overflow-hidden ${
          hasVoted
            ? 'bg-foreground/8 text-foreground/60 cursor-default border border-foreground/15'
            : 'bg-foreground text-background hover:shadow-lg active:scale-95'
        } ${showBloom ? 'animate-bloom' : ''}`}
      >
        {/* Button grid background */}
        <div className="absolute inset-0 grid-overlay opacity-0 transition-opacity duration-500" />
        
        {/* Button shine effect on hover */}
        {!hasVoted && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-500 bg-white" />
        )}
        
        <span className="relative z-10 font-semibold transition-all duration-300">{hasVoted ? '✓ Voted' : 'Vote'}</span>
        <span className="relative z-10 font-bold text-xs bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm transition-all duration-300">
          {product.vote_count}
        </span>
      </button>
    </div>
  )
}
