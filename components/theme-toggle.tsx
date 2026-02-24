'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10" />
  }

  const handleMaintenanceClick = () => {
    toast.error('Sementara fitur ubah tema sedang maintenance', {
      icon: <AlertCircle className="w-5 h-5" />,
      className: 'bg-destructive/90 text-destructive-foreground border border-destructive',
    })
  }

  return (
    <button
      onClick={handleMaintenanceClick}
      disabled
      className="fixed top-6 right-6 z-50 p-2 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-all duration-300 animate-fade-in-scale group animate-theme-transition opacity-60 cursor-not-allowed"
      aria-label="Toggle theme (disabled)"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-foreground" />
      ) : (
        <Moon className="w-5 h-5 text-foreground" />
      )}
    </button>
  )
}
