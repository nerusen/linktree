'use client'

import Image from 'next/image'
import { useState } from 'react'
import { X } from 'lucide-react'

interface Product {
  id: string
  title: string
  image_url: string
  description: string
  order: number
  vote_count: number
}

interface ProductModalProps {
  product: Product | null
  onClose: () => void
  hasVoted: boolean
  onVote: () => void
  isTopVoted?: boolean
}

export default function ProductModal({
  product,
  onClose,
  hasVoted,
  onVote,
  isTopVoted = false,
}: ProductModalProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [showBloom, setShowBloom] = useState(false)

  if (!product) return null

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-2xl w-full max-h-[90vh] bg-background rounded-3xl overflow-hidden shadow-2xl border border-foreground/20 animate-fade-in-scale">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 hover:bg-foreground/10 rounded-lg transition-all duration-300"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Product Image */}
          <div className="relative w-full aspect-square bg-foreground/10 border-b border-foreground/20">
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
              crossOrigin="anonymous"
              priority
            />

            {/* Terpilih Badge */}
            {isTopVoted && (
              <div className="absolute top-4 right-4 bg-emerald-500/90 text-white px-3 py-1.5 rounded-lg text-sm font-bold border border-emerald-300 shadow-lg backdrop-blur-sm">
                Terpilih
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {product.title}
            </h2>

            {/* Description */}
            <p className="text-base text-foreground/70 leading-relaxed mb-6 whitespace-pre-wrap">
              {product.description}
            </p>

            {/* Vote Stats */}
            <div className="flex items-center gap-4 py-4 border-t border-b border-foreground/10 mb-6">
              <div className="flex-1">
                <p className="text-sm text-foreground/60">Total Suara</p>
                <p className="text-2xl font-bold text-foreground">{product.vote_count}</p>
              </div>
              {hasVoted && (
                <div className="text-sm font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
                  ✓ Sudah Voting
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Vote Button */}
        <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-6 px-6 sm:px-8 border-t border-foreground/10">
          <button
            onClick={handleVote}
            disabled={hasVoted || isVoting}
            className={`relative w-full py-4 px-6 rounded-xl font-semibold text-base tracking-wide transition-all duration-500 flex items-center justify-center gap-3 overflow-hidden ${
              hasVoted
                ? 'bg-foreground/10 text-foreground/60 cursor-default border border-foreground/15'
                : 'bg-foreground text-background hover:shadow-xl active:scale-95'
            } ${showBloom ? 'animate-bloom' : ''}`}
          >
            {/* Button grid background */}
            <div className="absolute inset-0 grid-overlay opacity-0 transition-opacity duration-500" />

            {/* Button shine effect on hover */}
            {!hasVoted && (
              <div className="absolute inset-0 opacity-0 hover:opacity-20 transition-all duration-500 bg-white" />
            )}

            <span className="relative z-10 font-semibold">
              {hasVoted ? '✓ Sudah Voting' : 'Voting Sekarang'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
