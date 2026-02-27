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
        // Get all unique users who have voted
        const { data: votes, error: votesError } = await supabase
          .from('product_votes')
          .select('user_email')

        if (votesError) {
          console.error('Error fetching votes:', votesError)
          setLoading(false)
          return
        }

        // Filter unique emails
        const uniqueEmails = Array.from(new Set(votes?.map(v => v.user_email) || []))
        setTotalVoters(uniqueEmails.length)

        if (uniqueEmails.length > 0) {
          // Get user profiles for these emails, ordered by newest first (id/created_at)
          const { data: userProfiles } = await supabase
            .from('user_profiles')
            .select('id, avatar_url, username')
            .in('email', uniqueEmails)
            .order('id', { ascending: false }) // Assuming higher ID or created_at is newer
            .limit(3)

          setVoters(userProfiles || [])
        } else {
          setVoters([])
        }
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

  const displayVoters = voters.slice(0, 3)
  const remainingCount = Math.max(0, totalVoters - 3)

  return (
    <div className="flex flex-col items-center gap-4 justify-center">
      <div className="flex items-center">
        {/* Avatar Group */}
        <div className="flex items-center -space-x-4">
          {displayVoters.map((voter, index) => (
            <div
              key={voter.id}
              className="relative w-12 h-12 rounded-full border-4 border-background overflow-hidden bg-secondary flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110"
              style={{ zIndex: 10 - index }}
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
                <div className="w-full h-full bg-accent flex items-center justify-center text-white text-sm font-bold">
                  {(voter.username || 'U')?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))}
          
          {remainingCount > 0 && (
            <div 
              className="relative w-12 h-12 rounded-full border-4 border-background bg-neutral flex items-center justify-center flex-shrink-0 text-white text-sm font-bold z-0"
              title={`${remainingCount} more voters`}
            >
              +{remainingCount}
            </div>
          )}
        </div>
      </div>

      {/* Voter Count Text */}
      <div className="flex items-center gap-1.5 text-sm font-medium">
        {remainingCount > 0 ? (
          <span className="text-foreground/70">
            {remainingCount} {remainingCount === 1 ? 'other' : 'others'}
          </span>
        ) : null}
        <span className="text-foreground/40">
          ({totalVoters} {totalVoters === 1 ? 'voter' : 'voters'})
        </span>
      </div>
    </div>
  )
}
