'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  username?: string
  avatar_url?: string
}

export default function AuthHeader() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showBlur, setShowBlur] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()

        setUser({
          id: authUser.id,
          email: authUser.email || '',
          username: profile?.username || authUser.user_metadata?.name || 'User',
          avatar_url: profile?.avatar_url || authUser.user_metadata?.avatar_url
        })
      }
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            username: profile?.username || session.user.user_metadata?.name || 'User',
            avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url
          })
        } else {
          setUser(null)
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
        setShowBlur(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setShowDropdown(false)
    setShowBlur(false)
    router.push('/')
  }

  if (loading) {
    return null
  }

  return (
    <>
      {/* Blur overlay */}
      {showBlur && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => {
            setShowDropdown(false)
            setShowBlur(false)
          }}
        />
      )}

      <header className="fixed top-0 right-0 p-4 sm:p-6 z-50">
        {!user ? (
          // Login button
          <Link
            href="/login"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-foreground text-background rounded-lg font-semibold text-sm sm:text-base hover:bg-foreground/90 transition-all duration-300 active:scale-95"
          >
            Login
          </Link>
        ) : (
          // User profile section
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setShowDropdown(!showDropdown)
                setShowBlur(!showDropdown)
              }}
              className="flex items-center gap-2 sm:gap-3 p-1 sm:p-2 rounded-lg hover:bg-secondary/50 transition-all duration-300"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.username || 'User'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-accent flex items-center justify-center text-white font-bold text-sm">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-foreground">
                {user.username}
              </span>
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg p-4 animate-fade-in-scale">
                {/* User info */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.username || 'User'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-accent flex items-center justify-center text-white font-bold">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{user.username}</p>
                    <p className="text-xs text-foreground/60 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-semibold text-sm hover:bg-destructive/90 transition-all duration-300 active:scale-95"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  )
}
