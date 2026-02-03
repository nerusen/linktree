'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProfileSectionProps {
  profileImage?: string
  name: string
  subtitle: string
  bio: string
}

export default function ProfileSection({
  profileImage,
  name,
  subtitle,
  bio,
}: ProfileSectionProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in-up">
      {/* Profile Image with Google Border */}
      <div className="google-profile-border relative">
        <div className="relative w-24 h-24 rounded-full overflow-hidden" style={{ zIndex: 10 }}>
          {imageLoading && !imageError && (
            <div className="absolute inset-0 bg-muted rounded-full animate-shimmer" />
          )}
          {profileImage && !imageError ? (
            <Image
              src={profileImage || "/placeholder.svg"}
              alt={name}
              fill
              className="rounded-full object-cover"
              onLoadingComplete={() => setImageLoading(false)}
              onError={() => {
                setImageError(true)
                setImageLoading(false)
              }}
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <span className="text-sm">No image</span>
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{name}</h1>
        <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
      </div>

      {/* Bio */}
      {bio && (
        <p className="text-center text-sm text-muted-foreground max-w-md leading-relaxed">
          {bio}
        </p>
      )}
    </div>
  )
}
