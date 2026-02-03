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
    // Prevent default behavior and only update the filter state
    onTagChange(value === 'All' ? null : value)
  }

  return (
    <div className="w-full space-y-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      <div className="flex justify-center">
        <Select value={selectedTag || 'All'} onValueChange={handleChange}>
          <SelectTrigger className="w-full max-w-xs bg-card/50 backdrop-blur-sm border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer">
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

      {/* Trial Stage Alert */}
      <div className="flex justify-center">
        <Alert className="w-full max-w-md border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/40 dark:text-red-300">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Website in Trial Stage</AlertTitle>
          <AlertDescription>
            This website is currently in trial/development stage. Some features may be incomplete or subject to change.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
