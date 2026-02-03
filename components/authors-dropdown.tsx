'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDownIcon } from 'lucide-react'

interface Author {
  id: string
  username: string
  avatar: string
  email: string
}

interface AuthorsDropdownProps {
  authors: Author[]
}

export default function AuthorsDropdown({ authors }: AuthorsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed top-4 left-4 z-20 gap-2 backdrop-blur-sm bg-background/80 border-border/50 hover:bg-secondary/50"
        >
          Author
          <ChevronDownIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          {authors.map((author) => (
            <DropdownMenuItem key={author.id} className="gap-3 p-2">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.username} />
                <AvatarFallback>{author.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{author.username}</p>
                <p className="text-xs text-muted-foreground truncate">{author.email}</p>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
