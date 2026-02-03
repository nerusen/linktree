import { cn } from "@/lib/utils"

interface SafariProps {
  url?: string
  imageSrc?: string
  className?: string
}

export function Safari({ url = "example.com", imageSrc, className }: SafariProps) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto px-4", className)}>
      <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
        {/* Safari Browser Header */}
        <div className="bg-secondary/50 border-b border-border px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs font-semibold text-foreground/60 ml-2">Safari</span>
          </div>
          <div className="bg-muted/50 rounded-lg px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
            <span className="text-foreground/60">🔒</span>
            <span className="truncate font-mono">{url}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative w-full bg-background overflow-hidden">
          {imageSrc ? (
            <img
              src={imageSrc || "/placeholder.svg"}
              alt="Safari content"
              className="w-full h-auto object-cover"
            />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center bg-muted text-muted-foreground">
              <span>No content</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
