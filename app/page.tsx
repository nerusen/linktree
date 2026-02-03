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
  {
    id: '2',
    username: 'Nerusen',
    avatar: 'https://ik.imagekit.io/8sxh7zirl/Tak%20berjudul84_20260201143821.png',
    email: 'nerusendesign@gmail.com',
  },
]

const footerAvatars = [
  {
    src: 'https://ik.imagekit.io/8sxh7zirl/20251111_132031.jpg',
    alt: '@nelsen',
    fallback: 'NC',
  },
  {
    src: 'https://ik.imagekit.io/8sxh7zirl/Tak%20berjudul84_20260201143821.png',
    alt: '@nerusen',
    fallback: 'NR',
  },
  {
    src: 'https://ik.imagekit.io/8sxh7zirl/c9309af26cdf4a49443dde98b742a666.jpg?updatedAt=1760965529709',
    alt: '@nero',
    fallback: 'NE',
  },
  {
    src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop',
    alt: 'Developer',
    fallback: 'DV',
  },
  {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    alt: 'Designer',
    fallback: 'DS',
  },
  {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    alt: 'Manager',
    fallback: 'MG',
  },
]

const links: LinkItem[] = [
  {
    id: '1',
    title: 'Portfolio Website',
    url: 'https://nelsen.my.id',
    tag: 'Portfolio',
    icon: <Brush className="w-5 h-5" />,
    thumbnail: 'https://ik.imagekit.io/8sxh7zirl/20260203_152951.jpg',
    showThumbnail: true,
    thumbnailTag: 'Featured',
    showThumbnailTag: true,
    thumbnailTagBg: 'bg-lime-400/50 backdrop-blur-sm border border-lime-400 rounded-full',
    thumbnailTagText: 'text-white font-bold',
    showNotification: true,
    notificationTitle: 'Opening Portfolio',
    notificationDescription: 'Check out my latest work and projects',
  },
  {
    id: '2',
    title: 'GitHub Profile',
    url: 'https://github.com/nerusen',
    tag: 'Code',
    icon: <Github className="w-5 h-5" />,
    showNotification: true,
    notificationTitle: 'Opening GitHub',
    notificationDescription: 'Check out my repositories and contributions',
  },
  {
    id: '3',
    title: 'Instagram',
    url: 'https://instagram.com/n31sen.st',
    tag: 'Social',
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    id: '4',
    title: 'Email Me',
    url: 'mailto:xynelsdesign@gmail.com',
    tag: 'Contact',
    icon: <Mail className="w-5 h-5" />,
  },
  {
    id: '5',
    title: 'Repository',
    url: 'https://github.com/nerusen/nelsen.my.id',
    tag: 'Repo',
    icon: <FolderGit2 className="w-5 h-5" />,
    thumbnail: 'https://ik.imagekit.io/8sxh7zirl/nelsen-chandra-web.png',
    showThumbnail: false,
    thumbnailTag: 'Latest Post',
    showThumbnailTag: false,
    thumbnailTagBg: 'bg-purple-500/80',
    thumbnailTagText: 'text-white',
    showNotification: true,
    notificationTitle: 'Visiting Repo',
    notificationDescription: 'Check out our latest repository',
  },
  {
    id: '6',
    title: 'Project Preview',
    url: 'https://nelsen.my.id/projects',
    tag: 'Projects',
    icon: <FolderOpen className="w-5 h-5" />,
    thumbnail: 'https://ik.imagekit.io/8sxh7zirl/20251214_115428.png?updatedAt=1767193208348',
    showThumbnail: false,
    showNotification: true,
    notificationTitle: 'Visiting Projects',
    notificationDescription: 'Check out our latest projects',
  },
  {
    id: '7',
    title: 'Personal Website',
    url: 'https://nerusen.web.id',
    tag: 'Web',
    icon: <Globe className="w-5 h-5" />,
    thumbnail: 'https://ik.imagekit.io/8sxh7zirl/20251015_173931.png',
    showThumbnail: false,
    thumbnailTag: 'Live Project',
    showThumbnailTag: true,
    thumbnailTagBg: 'bg-green-500/80',
    thumbnailTagText: 'text-white',
    showNotification: true,
    notificationTitle: 'Launching Website',
    notificationDescription: 'Explore my personal projects and work',
  },
  {
    id: '8',
    title: 'Pricelist',
    url: 'https://nelsen.my.id/price-list',
    tag: 'Market',
    icon: <Store className="w-5 h-5" />,
  },
]

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [showThemeTransition, setShowThemeTransition] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    // Loading progress simulation
    setProgress(20)
    const timer1 = setTimeout(() => setProgress(50), 200)
    const timer2 = setTimeout(() => setProgress(80), 400)
    const timer3 = setTimeout(() => {
      setProgress(100)
      setIsLoading(false)
    }, 800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  // Expose theme transition to global scope
  useEffect(() => {
    ;(window as any).__triggerThemeTransition = () => {
      setShowThemeTransition(true)
      setTimeout(() => setShowThemeTransition(false), 600)
    }
  }, [])

  // Get unique tags for filtering
  const uniqueTags = [...new Set(links.map(link => link.tag))]

  // Filter links based on selected tag
  const filteredLinks = selectedTag
    ? links.filter(link => link.tag === selectedTag)
    : links

  return (
    <main className="min-h-screen w-full bg-background">
      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Progress value={progress} className="h-1 rounded-none" />
        </div>
      )}

      {/* Square Stack Theme Transition Overlay */}
      {showThemeTransition && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          {/* Green Square */}
          <div
            className="fixed inset-0 bg-green-500 animate-square-1"
            style={{
              zIndex: 1,
            }}
          />
          {/* White Square */}
          <div
            className="fixed inset-0 bg-white animate-square-2"
            style={{
              zIndex: 2,
            }}
          />
          {/* Black Square */}
          <div
            className="fixed inset-0 bg-black animate-square-3 dark:hidden"
            style={{
              zIndex: 3,
            }}
          />
          {/* Dark Mode - White Square */}
          <div
            className="fixed inset-0 bg-black hidden dark:block animate-square-3"
            style={{
              zIndex: 3,
            }}
          />
        </div>
      )}

      {/* Authors Dropdown */}
      {!isLoading && <AuthorsDropdown authors={authors} />}

      <ThemeToggle />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-20">
        <div className="w-full max-w-2xl">
          <div className="space-y-8">
            {/* Profile Section with skeleton animation */}
            <div className={isLoading ? 'animate-pulse' : 'animate-fade-in-up'}>
              <ProfileSection
                profileImage="https://ik.imagekit.io/8sxh7zirl/Tak%20berjudul84_20260201143821.png"
                name="n31sen.st"
                subtitle="Graphic Designer"
                bio="Create limitless creativity."
              />
            </div>

            {/* Filter Section */}
            {!isLoading && (
              <LinkFilter 
                tags={uniqueTags} 
                selectedTag={selectedTag} 
                onTagChange={setSelectedTag}
              />
            )}

            {/* Links Grid */}
            <div className="space-y-3">
              {isLoading ? (
                // Skeleton loading
                <>
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-24 rounded-lg bg-card border border-border animate-shimmer"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </>
              ) : (
                filteredLinks.length > 0 ? (
                  filteredLinks.map((link) => (
                    <LinkButton
                      key={link.id}
                      {...link}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No links found for this category</p>
                  </div>
                )
              )}
            </div>

            {/* FAQ Section */}
            {!isLoading && (
              <FAQSection />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 mt-8">
        {/* Avatar Section */}
        <AvatarSection avatars={footerAvatars} />
        
        {/* Copyright */}
        <p className="text-xs text-muted-foreground">©Copyright by Nelsen Chandra 2026, All Rights Reserved.</p>
      </footer>
    </main>
  )
}
