'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import VotingChart from '@/components/voting-chart'
import ProductCard from '@/components/product-card'
import ProfileSection from '@/components/profile-section'
import AuthorsDropdown from '@/components/authors-dropdown'
import { VotingDbInit } from '@/components/voting-db-init'
import { getClientIdentifier } from '@/lib/vote-utils'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Author {
  id: string
  username: string
  avatar: string
  email: string
}

const authors: Author[] = [
  {
    id: '1',
    username: 'Nelsen Chandra',
    avatar: 'https://ik.imagekit.io/8sxh7zirl/20251111_132031.jpg',
    email: 'nelsenchandra@gmail.com',
  },
  {
    id: '2',
    username: 'Nerusen',
    avatar: 'https://ik.imagekit.io/8sxh7zirl/Tak%20berjudul87_20260203172950.png',
    email: 'nerusendesign@gmail.com',
  },
]

interface Product {
  id: string
  title: string
  image_url: string
  order: number
  vote_count: number
}

export default function VotingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({})
  const [clientId, setClientId] = useState<string>('')
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
        .select('id, title, image_url, order')
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
      
      // Check which products the user has already voted for
      const votedProducts: Record<string, boolean> = {}
      const { data: userVotes } = await supabase
        .from('product_votes')
        .select('product_id')
        .eq('voter_ip_hash', clientId)

      userVotes?.forEach(vote => {
        votedProducts[vote.product_id] = true
      })
      setHasVoted(votedProducts)
      
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
    if (!clientId || hasVoted[productId]) return

    const { error } = await supabase
      .from('product_votes')
      .insert([
        {
          product_id: productId,
          voter_ip_hash: clientId,
        },
      ])

    if (error) {
      console.error('Error voting:', error)
      return
    }

    // Update local state
    setHasVoted(prev => ({ ...prev, [productId]: true }))
    setProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, vote_count: p.vote_count + 1 } : p
      )
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <VotingDbInit />
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl">
        {/* Back Button */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg hover:bg-secondary/50 text-foreground/60 hover:text-foreground transition-all duration-200 font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
        </div>

        {/* Profile Section */}
        <div className="mb-12 sm:mb-16">
          <ProfileSection
            profileImage="https://ik.imagekit.io/8sxh7zirl/20260203_152951.jpg"
            name="Farewell Design"
            subtitle="Product Voting Poll"
            bio="Vote for your favorite design and help us choose the best product direction"
          />
        </div>

        {/* Top Buttons */}
        <div className="flex justify-center gap-4 mb-10 sm:mb-14">
          <AuthorsDropdown authors={authors} />
          <button
            onClick={() => {
              toast.error('Sementara fitur ubah tema sedang maintenance', {
                icon: <AlertCircle className="w-5 h-5" />,
                className: 'bg-destructive/90 text-destructive-foreground border border-destructive',
              })
            }}
            disabled
            className="px-4 sm:px-6 py-2 rounded-lg border border-border bg-card hover:bg-secondary/50 text-foreground/60 font-medium text-sm opacity-60 cursor-not-allowed transition-all"
          >
            🌙 Theme
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-balance">
            Vote for Your Favorite Design
          </h1>
          <p className="text-foreground/60 text-sm sm:text-base">
            Choose the design that resonates with you the most
          </p>
        </div>

        {/* Chart Section */}
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6 mb-10 sm:mb-14">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-6">
            Vote Distribution
          </h2>
          <VotingChart products={products} />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {(() => {
            const maxVotes = Math.max(...products.map(p => p.vote_count), 0)
            return products.map((product, index) => (
              <div 
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard
                  product={product}
                  hasVoted={hasVoted[product.id] || false}
                  onVote={() => handleVote(product.id)}
                  isTopVoted={maxVotes > 0 && product.vote_count === maxVotes}
                />
              </div>
            ))
          })()}
        </div>
      </div>
    </main>
  )
}
