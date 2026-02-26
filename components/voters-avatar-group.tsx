'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface VoterProfile {
  id: string
  avatar_url?: string
  username?: string
}

export default function VotersAvatarGroup() {
  const [voters, setVoters] = useState<VoterProfile[]>([])
  const [totalVoters, setTotalVoters] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        // Get all voters from product_votes table using email
        const { data: votes, error: votesError } = await supabase
          .from('product_votes')
          .select('user_email')
          .distinct()

        if (votesError) {
          console.error('Error fetching voters:', votesError)
          setLoading(false)
          return
        }

        setTotalVoters(votes?.length || 0)

        // Get user profiles who have voted (first 5)
        const voterEmails = votes?.map((v: any) => v.user_email) || []
        
        let profiles: VoterProfile[] = []
        
        if (voterEmails.length > 0) {
          const { data: userProfiles } = await supabase
            .from('user_profiles')
            .select('id, avatar_url, username')
            .in('email', voterEmails.slice(0, 5))

          profiles = userProfiles || []
        }

        setVoters(profiles)
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVoters()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('voters_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_votes',
        },
        () => {
          fetchVoters()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  if (loading) {
    return null
  }

  const displayVoters = voters.slice(0, 5)
  const remainingCount = Math.max(0, totalVoters - 5)

  return (
    <div className="flex items-center gap-3 justify-center">
      {/* Avatar Group */}
      <div className="flex items-center -space-x-2">
        {displayVoters.map((voter, index) => (
          <div
            key={voter.id}
            className="relative w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-secondary flex items-center justify-center flex-shrink-0"
            style={{ zIndex: displayVoters.length - index }}
            title={voter.username || 'Voter'}
          >
            {voter.avatar_url ? (
              <Image
                src={voter.avatar_url}
                alt={voter.username || 'Voter'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-accent flex items-center justify-center text-white text-xs font-bold">
                {(voter.username || 'U')?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Remaining Count */}
      {remainingCount > 0 && (
        <p className="text-sm text-foreground/70 font-medium">
          +{remainingCount} {remainingCount === 1 ? 'other' : 'others'}
        </p>
      )}

      {/* Total Count */}
      <p className="text-sm text-foreground/60 font-medium">
        ({totalVoters} {totalVoters === 1 ? 'voter' : 'voters'})
      </p>
    </div>
  )
}
