'use client'

import React, { forwardRef, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Mail, Briefcase, Code, Globe, FileText, Github, Linkedin, Twitter } from 'lucide-react'

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'z-10 flex size-12 items-center justify-center rounded-full border-2 bg-card border-border p-3 shadow-sm',
        className
      )}
    >
      {children}
    </div>
  )
})

Circle.displayName = 'Circle'

export function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)
  const div6Ref = useRef<HTMLDivElement>(null)
  const div7Ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className='relative flex w-full items-center justify-center overflow-hidden bg-background rounded-2xl border border-border p-10 animate-fade-in-up'
      ref={containerRef}
    >
      <div className='flex w-full max-w-lg flex-col items-stretch justify-between gap-10'>
        <div className='flex flex-row items-center justify-between'>
          <Circle ref={div1Ref} className='bg-card hover:bg-secondary/50 transition-colors'>
            <Mail className='w-6 h-6 text-foreground' />
          </Circle>
          <Circle ref={div5Ref} className='bg-card hover:bg-secondary/50 transition-colors'>
            <Briefcase className='w-6 h-6 text-foreground' />
          </Circle>
        </div>
        <div className='flex flex-row items-center justify-between'>
          <Circle ref={div2Ref} className='bg-card hover:bg-secondary/50 transition-colors'>
            <Code className='w-6 h-6 text-foreground' />
          </Circle>
          <Circle ref={div4Ref} className='size-16 bg-primary hover:bg-primary/90 transition-colors'>
            <Globe className='w-8 h-8 text-primary-foreground' />
          </Circle>
          <Circle ref={div6Ref} className='bg-card hover:bg-secondary/50 transition-colors'>
            <FileText className='w-6 h-6 text-foreground' />
          </Circle>
        </div>
        <div className='flex flex-row items-center justify-between'>
          <Circle ref={div3Ref} className='bg-card hover:bg-secondary/50 transition-colors'>
            <Github className='w-6 h-6 text-foreground' />
          </Circle>
          <Circle ref={div7Ref} className='bg-card hover:bg-secondary/50 transition-colors'>
            <Linkedin className='w-6 h-6 text-foreground' />
          </Circle>
        </div>
      </div>
    </div>
  )
}

export default AnimatedBeamDemo
