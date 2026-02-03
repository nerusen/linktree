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
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    email: 'nelsen@example.com',
  },
  {
    id: '2',
    username: 'Designer Co.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    email: 'design@example.com',
  },
  {
    id: '3',
    username: 'Developer Team',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    email: 'dev@example.com',
  },
]

const footerAvatars = [
  {
    src: 'https://github.com/shadcn.png',
    alt: '@shadcn',
    fallback: 'CN',
  },
  {
    src: 'https://github.com/maxleiter.png',
    alt: '@maxleiter',
    fallback: 'ML',
  },
  {
    src: 'https://github.com/evilrabbit.png',
    alt: '@evilrabbit',
    fallback: 'ER',
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
    url: 'https://vercel.com',
    tag: 'Portfolio',
    icon: <Briefcase className="w-5 h-5" />,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1280&h=720&fit=crop',
    showThumbnail: true,
    thumbnailTag: 'Featured',
    showThumbnailTag: true,
    thumbnailTagBg: 'bg-blue-500/80',
    thumbnailTagText: 'text-white',
    showNotification: true,
    notificationTitle: 'Opening Portfolio',
    notificationDescription: 'Check out my latest work and projects',
  },
  {
    id: '2',
    title: 'GitHub Profile',
    url: 'https://github.com',
    tag: 'Code',
    icon: <Github className="w-5 h-5" />,
    showNotification: true,
    notificationTitle: 'Opening GitHub',
    notificationDescription: 'Check out my repositories and contributions',
  },
  {
    id: '3',
    title: 'LinkedIn',
    url: 'https://linkedin.com',
    tag: 'Professional',
    icon: <Linkedin className="w-5 h-5" />,
  },
  {
    id: '4',
    title: 'Email Me',
    url: 'mailto:hello@example.com',
    tag: 'Contact',
    icon: <Mail className="w-5 h-5" />,
  },
  {
    id: '5',
    title: 'My Blog',
    url: 'https://vercel.com/blog',
    tag: 'Writing',
    icon: <FileText className="w-5 h-5" />,
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1280&h=720&fit=crop',
    showThumbnail: true,
    thumbnailTag: 'Latest Post',
    showThumbnailTag: true,
    thumbnailTagBg: 'bg-purple-500/80',
    thumbnailTagText: 'text-white',
    showNotification: true,
    notificationTitle: 'Visiting Blog',
    notificationDescription: 'Read my latest articles and insights',
  },
  {
    id: '6',
    title: 'GitHub Repository',
    url: 'https://github.com',
    tag: 'Projects',
    icon: <Code className="w-5 h-5" />,
  },
  {
    id: '7',
    title: 'Personal Website',
    url: 'https://vercel.com',
    tag: 'Web',
    icon: <Globe className="w-5 h-5" />,
    thumbnail: 'https://images.unsplash.com/photo-1467232557153-f403bf289096?w=1280&h=720&fit=crop',
    showThumbnail: true,
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
    title: 'Twitter/X',
    url: 'https://twitter.com',
    tag: 'Social',
    icon: <Twitter className="w-5 h-5" />,
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
                profileImage="https://ik.imagekit.io/8sxh7zirl/Tak%20berjudul42_20260115160409.png?updatedAt=1770040741025"
                bannerImage="https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=800&h=320&fit=crop"
                name="Nelsen Chandra"
                subtitle="Full Stack Developer & Designer"
                bio="Crafting elegant digital experiences with code and design. Passionate about building performant, accessible web applications."
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
        <p className="text-xs text-muted-foreground">©Copyright by Nelsen Chandra 2026</p>
      </footer>
    </main>
  )
}
