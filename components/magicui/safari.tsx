import Image from "next/image"
import { cn } from "@/lib/utils"

interface SafariProps {
  url?: string
  imageSrc?: string
  className?: string
}

export function Safari({ url = "example.com", imageSrc, className }: SafariProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
        {/* Safari Browser Header */}
        <div className="bg-card border-b border-border px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div className="bg-muted rounded-lg px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
            <span>🔒</span>
            <span className="truncate">{url}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative w-full bg-background">
          {imageSrc && (
            <div className="relative w-full aspect-video">
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt="Safari content"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
