'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangleIcon } from 'lucide-react'

interface LinkFilterProps {
  tags: string[]
  selectedTag: string | null
  onTagChange: (tag: string | null) => void
}

export default function LinkFilter({ tags, selectedTag, onTagChange }: LinkFilterProps) {
  const uniqueTags = ['All', ...tags]

  const handleChange = (value: string) => {
    onTagChange(value === 'All' ? null : value)
  }

  return (
    <div className="w-full flex flex-col items-center space-y-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      
      {/* 1. Trial Stage Alert (Sekarang di ATAS) */}
      <div className="w-full flex justify-center">
        <Alert className="w-full max-w-md border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/40 dark:text-red-300 rounded-lg shadow-sm">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Website masih dalam tahap pengembangan</AlertTitle>
          <AlertDescription>
            Beberapa fitur masih dalam tahap uji coba, mungkin terdapat masalah kemudian. Harap laporkan pada author jika anda menemukan bug, Terimakasih.
          </AlertDescription>
        </Alert>
      </div>

      {/* 2. Filter Tag (Sekarang di BAWAH) */}
      <div className="w-full flex justify-center">
        <Select value={selectedTag || 'All'} onValueChange={handleChange}>
          <SelectTrigger className="w-full max-w-xs bg-card/50 backdrop-blur-sm border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer rounded-md">
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {uniqueTags.map((tag) => (
                <SelectItem key={tag} value={tag} className="cursor-pointer">
                  {tag}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
    </div>
  )
}
