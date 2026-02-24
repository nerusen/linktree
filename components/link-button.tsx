'use client'

import React from "react"

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface LinkButtonProps {
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

export default function LinkButton({
  id,
  title,
  url,
  tag,
  icon,
  thumbnail,
  showThumbnail = false,
  thumbnailTag,
  showThumbnailTag = false,
  thumbnailTagBg = 'bg-black/50',
  thumbnailTagText = 'text-white',
  showNotification = false,
  notificationTitle,
  notificationDescription,
}: LinkButtonProps) {
  const router = useRouter()
  const [thumbnailLoading, setThumbnailLoading] = useState(true)
  const [thumbnailError, setThumbnailError] = useState(false)

  const handleClick = () => {
    // Internal routes (like /voting) navigate without notification
    if (url?.startsWith('/')) {
      router.push(url)
    } else if (showNotification) {
      toast(notificationTitle || `Opening ${title}`, {
        description: notificationDescription || `Redirecting to ${title}...`,
        action: {
          label: 'Go',
          onClick: () => {
            if (url) {
              window.open(url, '_blank', 'noopener,noreferrer')
            }
          },
        },
      })
    } else {
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      className="group w-full text-left transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${parseInt(id) * 50}ms` }}
    >
      <div className="relative rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors duration-300 overflow-hidden">
        {/* Thumbnail - 16:9 Landscape */}
        {showThumbnail && thumbnail && (
          <div className="relative w-full bg-muted overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
            {thumbnailLoading && !thumbnailError && (
              <div className="absolute inset-0 bg-muted animate-shimmer" />
            )}
            {!thumbnailError ? (
              <>
                <Image
                  src={thumbnail || "/placeholder.svg"}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onLoadingComplete={() => setThumbnailLoading(false)}
                  onError={() => {
                    setThumbnailError(true)
                    setThumbnailLoading(false)
                  }}
                  crossOrigin="anonymous"
                />
                {/* Thumbnail Tag using Badge */}
                {showThumbnailTag && thumbnailTag && (
                  <div className="absolute top-2 right-2">
                    <Badge className={`${thumbnailTagBg} ${thumbnailTagText} text-xs font-medium backdrop-blur-sm`}>
                      {thumbnailTag}
                    </Badge>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-muted">
                Image unavailable
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Top row: Icon and external link */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-foreground flex-shrink-0">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {title}
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Tag */}
          <div className="flex items-center gap-2">
            <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded">
              {tag}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
