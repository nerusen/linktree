"use client"

import { useEffect, useState } from "react"

export function TypingAnimation({ children }: { children: string }) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let index = 0
    const text = children

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        setIsComplete(true)
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [children])

  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-foreground min-h-8">
        {displayedText}
        {!isComplete && (
          <span className="inline-block w-0.5 h-8 ml-1 bg-foreground animate-pulse" />
        )}
      </h2>
    </div>
  )
}
