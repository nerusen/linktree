'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import VotingChart from '@/components/voting-chart'
import ProductCard from '@/components/product-card'
import ProductModal from '@/components/product-modal'
import ProfileSection from '@/components/profile-section'
import AuthHeader from '@/components/auth-header'
import VotersAvatarGroup from '@/components/voters-avatar-group'
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
  const [isVotingOpen, setIsVotingOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()
  }, [supabase])

  useEffect(() => {
    // Get client identifier
    getClientIdentifier().then(id => setClientId(id))
  }, [])

  useEffect(() => {
    if (!clientId) return

    const fetchProducts = async () => {
      // Fetch voting status
      const { data: votingStatusData } = await supabase
        .from('voting_status')
        .select('is_open')
        .single()

      if (votingStatusData) {
        setIsVotingOpen(votingStatusData.is_open)
      }

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

    // Check if user is authenticated
    if (!isAuthenticated) {
      setNotificationMessage('Silakan login terlebih dahulu untuk melakukan voting')
      setTimeout(() => setNotificationMessage(null), 4000)
      return
    }

    // Check if voting is open
    if (!isVotingOpen) {
      setNotificationMessage('Voting telah ditutup')
      setTimeout(() => setNotificationMessage(null), 4000)
      return
    }

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
            <p className="text-foreground/60 text-sm">Farewell Voting</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background grid-background relative overflow-hidden">
      <VotingDbInit />
      <AuthHeader />
      
      {/* Grid background overlay */}
      <div className="absolute inset-0 grid-overlay pointer-events-none" />
      
      {/* Notification */}
      {notificationMessage && (
        <div className="fixed top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 max-w-md z-50 animate-fade-in">
          <div className="flex items-center gap-3 px-4 py-3 bg-destructive/90 text-destructive-foreground rounded-lg shadow-lg border border-destructive/50 backdrop-blur-sm">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">{notificationMessage}</p>
          </div>
        </div>
      )}
      
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
            profileImage="https://ik.imagekit.io/8sxh7zirl/Tak%20berjudul87_20260225095212.png"
            name="Farewell Vote"
            subtitle="Design Voting Poll"
            bio=""
          />
        </div>

        {/* Total Votes Counter */}
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-5xl sm:text-6xl font-bold text-foreground transition-all duration-300 mb-4">
            {products.reduce((sum, p) => sum + p.vote_count, 0)}
            <span className="text-2xl sm:text-3xl ml-3 text-foreground/60 font-semibold">Suara</span>
          </p>
        </div>

        {/* Voters Avatar Group */}
        <div className="mb-14 sm:mb-16">
          <VotersAvatarGroup />
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
                    isVotingOpen={isVotingOpen}
                    isAuthenticated={isAuthenticated}
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
