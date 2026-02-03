'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProfileSectionProps {
  profileImage?: string
  bannerImage?: string
  name: string
  subtitle: string
  bio: string
}

export default function ProfileSection({
  profileImage,
  bannerImage,
  name,
  subtitle,
  bio,
}: ProfileSectionProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [bannerLoading, setBannerLoading] = useState(true)
  const [bannerError, setBannerError] = useState(false)

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in-up">
      {/* HERE ME Label */}
      <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full animate-fade-in-up">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm font-bold text-foreground">HERE ME</span>
      </div>

      {/* Banner and Profile Container */}
      <div className="relative w-full max-w-md">
        {/* Banner Section */}
        <div className="relative w-full bg-card rounded-3xl overflow-hidden border border-border shadow-sm">
          {/* Banner Image */}
          <div className="relative w-full h-40 bg-muted">
            {bannerLoading && !bannerError && (
              <div className="absolute inset-0 bg-muted animate-shimmer" />
            )}
            {bannerImage && !bannerError ? (
              <Image
                src={bannerImage || "/placeholder.svg"}
                alt="Banner"
                fill
                className="object-cover"
                onLoadingComplete={() => setBannerLoading(false)}
                onError={() => {
                  setBannerError(true)
                  setBannerLoading(false)
                }}
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <span className="text-lg font-semibold">Banner</span>
              </div>
            )}
          </div>

          {/* Profile Photo - Overlapping */}
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-1/2 z-20">
            <div className="google-profile-border">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-card flex-shrink-0">
                {imageLoading && !imageError && (
                  <div className="absolute inset-0 rounded-full animate-shimmer" />
                )}
                {profileImage && !imageError ? (
                  <Image
                    src={profileImage || "/placeholder.svg"}
                    alt={name}
                    fill
                    className="rounded-full object-cover"
                    sizes="128px"
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
          </div>
        </div>

        {/* Profile Info - Below the banner/photo */}
        <div className="text-center space-y-2 mt-20 px-4">
          <h1 className="text-3xl font-bold text-foreground">{name}</h1>
          <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-center text-sm text-muted-foreground max-w-md leading-relaxed mt-3 px-4">
            {bio}
          </p>
        )}
      </div>
    </div>
  )
}
