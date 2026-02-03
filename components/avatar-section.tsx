'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar'

interface AvatarItem {
  src: string
  alt: string
  fallback: string
}

interface AvatarSectionProps {
  avatars: AvatarItem[]
}

export default function AvatarSection({ avatars }: AvatarSectionProps) {
  // Show first 3 avatars, rest count as +N
  const displayedAvatars = avatars.slice(0, 3)
  const remainingCount = avatars.length - 3

  return (
    <div className="flex justify-center mb-6">
      <AvatarGroup className="grayscale hover:grayscale-0 transition-all duration-300">
        {displayedAvatars.map((avatar, index) => (
          <Avatar key={index} className="animate-fade-in-scale" style={{ animationDelay: `${index * 100}ms` }}>
            <AvatarImage src={avatar.src || "/placeholder.svg"} alt={avatar.alt} />
            <AvatarFallback>{avatar.fallback}</AvatarFallback>
          </Avatar>
        ))}
        {remainingCount > 0 && <AvatarGroupCount>+{remainingCount}</AvatarGroupCount>}
      </AvatarGroup>
    </div>
  )
}
