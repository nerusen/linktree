"use client"

import { cn } from "@/lib/utils"
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react"

interface ClientTweetCardProps {
  id?: string
}

export function ClientTweetCard({ id }: ClientTweetCardProps) {
  return (
    <div className={cn(
      "relative w-full max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6",
      "hover:bg-secondary/50 transition-colors duration-300"
    )}>
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex-shrink-0"></div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground">Nelsen Chandra</h3>
              <span className="text-muted-foreground">@nelsendesign</span>
            </div>
            <span className="text-muted-foreground text-sm">2h</span>
          </div>

          {/* Tweet Body */}
          <p className="mt-3 text-foreground leading-relaxed">
            Just launched my new portfolio website! The animations are smooth, the design is clean, and the experience is incredible. Check it out and let me know what you think! 🚀
          </p>

          {/* Tweet Image */}
          <div className="mt-4 rounded-2xl overflow-hidden bg-muted border border-border aspect-video flex items-center justify-center text-muted-foreground">
            [Portfolio Preview]
          </div>

          {/* Engagement Metrics */}
          <div className="mt-4 flex gap-8 text-muted-foreground text-sm">
            <span>123 Comments</span>
            <span>456 Retweets</span>
            <span>789 Likes</span>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-between text-muted-foreground gap-4">
            <button className="flex items-center gap-2 hover:text-accent transition-colors hover:bg-accent/10 rounded-full px-3 py-1">
              <MessageCircle size={16} />
            </button>
            <button className="flex items-center gap-2 hover:text-green-500 transition-colors hover:bg-green-500/10 rounded-full px-3 py-1">
              <Repeat2 size={16} />
            </button>
            <button className="flex items-center gap-2 hover:text-red-500 transition-colors hover:bg-red-500/10 rounded-full px-3 py-1">
              <Heart size={16} />
            </button>
            <button className="flex items-center gap-2 hover:text-accent transition-colors hover:bg-accent/10 rounded-full px-3 py-1">
              <Share size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
