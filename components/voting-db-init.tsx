'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function VotingDbInit() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initializeDatabase = async () => {
      if (initialized) return

      try {
        const supabase = createClient()

        // Check if products table exists and has data
        const { data: existingProducts, error: checkError } = await supabase
          .from('farewell_products')
          .select('id')
          .limit(1)

        // If products exist, no need to reinitialize
        if (existingProducts && existingProducts.length > 0) {
          setInitialized(true)
          return
        }

        // Insert sample products
        const { error: insertError } = await supabase
          .from('farewell_products')
          .insert([
            {
              title: 'Minimalist Kit',
              image_url: 'https://images.unsplash.com/photo-1552662237-6b2d7dcbc4b0?w=500&h=500&fit=crop',
              order: 1,
            },
            {
              title: 'Neon Dream',
              image_url: 'https://images.unsplash.com/photo-1559386914222-35bfb9bb2f7e?w=500&h=500&fit=crop',
              order: 2,
            },
            {
              title: 'Vintage Vibes',
              image_url: 'https://images.unsplash.com/photo-1506755855926-34d408b92f9e?w=500&h=500&fit=crop',
              order: 3,
            },
            {
              title: 'Modern Edge',
              image_url: 'https://images.unsplash.com/photo-1540932239986-a128078bae20?w=500&h=500&fit=crop',
              order: 4,
            },
            {
              title: 'Nature Inspired',
              image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=500&fit=crop',
              order: 5,
            },
            {
              title: 'Bold Statement',
              image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
              order: 6,
            },
            {
              title: 'Sleek Future',
              image_url: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=500&fit=crop',
              order: 7,
            },
            {
              title: 'Elegant Classic',
              image_url: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop',
              order: 8,
            },
          ])

        if (!insertError) {
          setInitialized(true)
        }
      } catch (error) {
        console.error('Database initialization error:', error)
      }
    }

    initializeDatabase()
  }, [initialized])

  return null // This component doesn't render anything
}
