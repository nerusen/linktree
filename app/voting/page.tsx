'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import VotingChart from '@/components/voting-chart'
import ProductCard from '@/components/product-card'
import { VotingDbInit } from '@/components/voting-db-init'
import { getClientIdentifier } from '@/lib/vote-utils'

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
          const { data: voteData } = await supabase
            .from('product_votes')
            .select('id', { count: 'exact', head: true })
            .eq('product_id', product.id)

          const voteCount = voteData?.length || 0
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
    <main className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <VotingDbInit />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Farewell Design</h1>
          <p className="text-foreground/60 text-lg">Vote for your favorite product design</p>
        </div>

        {/* Chart Section */}
        <div className="bg-card rounded-2xl p-6 mb-12 shadow-lg border border-border">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Vote Distribution</h2>
          <VotingChart products={products} />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              hasVoted={hasVoted[product.id] || false}
              onVote={() => handleVote(product.id)}
            />
          ))}
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  )
}
