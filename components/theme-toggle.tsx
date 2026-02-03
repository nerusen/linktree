'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10" />
  }

  const toggleTheme = () => {
    // Trigger the shape transition
    if (typeof window !== 'undefined' && (window as any).__triggerThemeTransition) {
      (window as any).__triggerThemeTransition()
    }
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-2 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-all duration-300 animate-fade-in-scale group animate-theme-transition"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-foreground group-hover:scale-110 transition-transform" />
      ) : (
        <Moon className="w-5 h-5 text-foreground group-hover:scale-110 transition-transform" />
      )}
    </button>
  )
}
