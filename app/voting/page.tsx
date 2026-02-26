'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import VotingChart from '@/components/voting-chart'
import ProductCard from '@/components/product-card'
import ProductModal from '@/components/product-modal'
import ProfileSection from '@/components/profile-section'
import { VotingDbInit } from '@/components/voting-db-init'
import { getClientIdentifier } from '@/lib/vote-utils'

interface Product {
  id: string
  title: string
  image_url: string
  description?: string
  order: number
  vote_count: number
}

export default function VotingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentVote, setCurrentVote] = useState<string | null>(null)
  const [clientId, setClientId] = useState<string>('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Get client identifier
    getClientIdentifier().then(id => setClientId(id))
  }, [])

  useEffect(() => {
    if (!clientId) return

    const fetchProducts = async () => {
      // Fetch products and their vote counts
      const { data: productsData, error: productsError } = await supabase
        .from('farewell_products')
        .select('id, title, image_url, description, order')
        .order('order', { ascending: true })

      if (productsError) {
        console.error('Error fetching products:', productsError)
        setLoading(false)
        return
      }

      // Fetch vote counts for each product
      const productsWithVotes = await Promise.all(
        productsData.map(async (product) => {
          const { count } = await supabase
            .from('product_votes')
            .select('*', { count: 'exact', head: true })
            .eq('product_id', product.id)

          const voteCount = count || 0
          return { ...product, vote_count: voteCount }
        })
      )

      setProducts(productsWithVotes)
      
      // Check which product the user has currently voted for
      const { data: userVote } = await supabase
        .from('product_votes')
        .select('product_id')
        .eq('voter_ip_hash', clientId)
        .single()

      if (userVote?.product_id) {
        setCurrentVote(userVote.product_id)
      }
      
      setLoading(false)
    }

    fetchProducts()

    // Subscribe to vote count changes for real-time updates
    const subscription = supabase
      .channel('votes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_votes',
        },
        () => {
          // Refetch products when votes change
          fetchProducts()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [clientId])

  const handleVote = async (productId: string) => {
    if (!clientId) return

    try {
      if (currentVote === productId) {
        // Voting same product again, just return
        return
      }

      if (currentVote) {
        // User already has a vote, need to update it
        const { error: updateError } = await supabase
          .from('product_votes')
          .update({ product_id: productId })
          .eq('voter_ip_hash', clientId)

        if (updateError) {
          console.error('Error updating vote:', updateError)
          return
        }

        // Update local state - decrease old product, increase new product
        setProducts(prev =>
          prev.map(p => {
            if (p.id === currentVote && p.vote_count > 0) {
              return { ...p, vote_count: p.vote_count - 1 }
            }
            if (p.id === productId) {
              return { ...p, vote_count: p.vote_count + 1 }
            }
            return p
          })
        )
      } else {
        // First time voting
        const { error: insertError } = await supabase
          .from('product_votes')
          .insert([
            {
              product_id: productId,
              voter_ip_hash: clientId,
            },
          ])

        if (insertError) {
          console.error('Error voting:', insertError)
          return
        }

        // Update local state - increase product count
        setProducts(prev =>
          prev.map(p =>
            p.id === productId ? { ...p, vote_count: p.vote_count + 1 } : p
          )
        )
      }

      setCurrentVote(productId)
    } catch (error) {
      console.error('Vote error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-accent/20"></div>
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin"></div>
            </div>
            <p className="text-foreground/60 text-sm">Farewell Design</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background grid-background relative overflow-hidden">
      <VotingDbInit />
      
      {/* Grid background overlay */}
      <div className="absolute inset-0 grid-overlay pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12 max-w-6xl">
        {/* Back Button */}
        <div className="mb-8 sm:mb-10">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg hover:bg-secondary/50 text-foreground/60 hover:text-foreground transition-all duration-300 font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
        </div>

        {/* Profile Section */}
        <div className="mb-10 sm:mb-12">
          <ProfileSection
            profileImage="https://ik.imagekit.io/8sxh7zirl/20260203_152951.jpg"
            name="Farewell Design"
            subtitle="Product Voting Poll"
            bio="Vote for your favorite design and help us choose the best product direction"
          />
        </div>

        {/* Total Votes Counter */}
        <div className="text-center mb-14 sm:mb-16">
          <p className="text-5xl sm:text-6xl font-bold text-foreground transition-all duration-300">
            {products.reduce((sum, p) => sum + p.vote_count, 0)}
            <span className="text-2xl sm:text-3xl ml-3 text-foreground/60 font-semibold">Suara</span>
          </p>
        </div>

        {/* Products Grid Section */}
        <div className="mb-16 sm:mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {(() => {
              const maxVotes = Math.max(...products.map(p => p.vote_count), 0)
              return products.map((product, index) => (
                <div 
                  key={product.id}
                  className="animate-fade-in-up transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard
                    product={product}
                    hasVoted={currentVote === product.id}
                    onVote={() => handleVote(product.id)}
                    isTopVoted={maxVotes > 0 && product.vote_count === maxVotes}
                    onImageClick={() => setSelectedProduct(product)}
                  />
                </div>
              ))
            })()}
          </div>
        </div>

        {/* Chart Section - Bottom */}
        <div className="border-t border-foreground/10 pt-10 sm:pt-12">
          <VotingChart products={products} />
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          hasVoted={currentVote === selectedProduct.id}
          onVote={() => {
            handleVote(selectedProduct.id)
            setSelectedProduct(null)
          }}
          isTopVoted={Math.max(...products.map(p => p.vote_count), 0) > 0 && selectedProduct.vote_count === Math.max(...products.map(p => p.vote_count), 0)}
        />
      )}
    </main>
  )
}
