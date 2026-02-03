'use client'

import React from "react"
import { useState, useEffect } from 'react'
import ProfileSection from '@/components/profile-section'
import LinkButton from '@/components/link-button'
import ThemeToggle from '@/components/theme-toggle'
import FAQSection from '@/components/faq-section'
import AuthorsDropdown from '@/components/authors-dropdown'
import LinkFilter from '@/components/link-filter'
import AvatarSection from '@/components/avatar-section'
import { Progress } from '@/components/ui/progress'
import {
  Github,
  Linkedin,
  Twitter,
  FolderGit2,
  FolderOpen,
  Store,
  Instagram,
  Brush,
  Mail,
  Briefcase,
  FileText,
  Code,
  Globe,
} from 'lucide-react'

interface LinkItem {
  id: string
  title: string
  url: string
  tag: string
  icon: React.ReactNode
  thumbnail?: string
  showThumbnail?: boolean
  thumbnailTag?: string
  showThumbnailTag?: boolean
  thumbnailTagBg?: string
  thumbnailTagText?: string
  showNotification?: boolean
  notificationTitle?: string
  notificationDescription?: string
}

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
]

const allLinks: LinkItem[] = [
  {
    id: '1',
    title: 'Portofolio Personal',
    url: 'https://nelsen.pro',
    tag: 'Project',
    icon: <Globe className="w-5 h-5" />,
    showNotification: true,
    notificationTitle: "New",
    notificationDescription: "Updated site"
  },
  {
    id: '2',
    title: 'GitHub Profile',
    url: 'https://github.com/nelsenchandra',
    tag: 'Social',
    icon: <Github className="w-5 h-5" />,
  },
  // Tambahkan link lainnya di sini sesuai data Anda sebelumnya
]

const footerAvatars = [
  { id: '1', name: 'Nelsen', image: 'https://ik.imagekit.io/8sxh7zirl/20251111_132031.jpg' },
  { id: '2', name: 'Dev', image: 'https://i.pravatar.cc/150?u=2' },
]

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Menunggu sedikit lebih lama untuk sinkronisasi dengan overlay
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const filteredLinks = activeCategory === 'All'
    ? allLinks
    : allLinks.filter(link => link.tag === activeCategory)

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      
      {/* 3 TUMPUKAN WARNA TRANSISI (ANIMASI AWAL) */}
      <div className="layer-red animate-overlay" style={{ animationDelay: '0ms' }}></div>
      <div className="layer-black animate-overlay" style={{ animationDelay: '120ms' }}></div>
      <div className="layer-white animate-overlay" style={{ animationDelay: '240ms' }}></div>

      {/* WRAPPER KONTEN UTAMA - Muncul setelah overlay lewat */}
      <div className="content-smooth-in" style={{ animationDelay: '1s' }}>
        <div className="max-w-md mx-auto px-6 py-12 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <AuthorsDropdown authors={authors} />
            <ThemeToggle />
          </div>

          <div className="space-y-8">
            <ProfileSection />
            
            <LinkFilter 
              activeCategory={activeCategory} 
              onCategoryChange={setActiveCategory} 
            />

            {/* Links Grid dengan Staggered Delay */}
            <div className="space-y-3">
              {isLoading ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-24 rounded-lg bg-card border border-border animate-shimmer"
                    />
                  ))}
                </>
              ) : (
                filteredLinks.length > 0 ? (
                  filteredLinks.map((link, index) => (
                    <div 
                      key={link.id} 
                      className="content-smooth-in"
                      style={{ 
                        // Delay bertahap: Start dari 1.1s + 80ms per item
                        animationDelay: `${1.1 + (index * 0.08)}s` 
                      }}
                    >
                      <LinkButton {...link} />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No links found for this category</p>
                  </div>
                )
              )}
            </div>

            {!isLoading && <FAQSection />}
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 text-center py-6 mt-8">
          <AvatarSection avatars={footerAvatars} />
          <p className="text-xs text-muted-foreground">
            ©Copyright by Nelsen Chandra 2026, All Rights Reserved.
          </p>
        </footer>
      </div>
    </main>
  )
}
