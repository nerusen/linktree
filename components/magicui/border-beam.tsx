'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface BorderBeamProps {
  size?: number
  initialOffset?: number
  className?: string
  transition?: {
    type?: string
    stiffness?: number
    damping?: number
    duration?: number
  }
}

export function BorderBeam({
  size = 40,
  initialOffset = 20,
  className = '',
  transition = {},
}: BorderBeamProps) {
  const {
    type = 'spring',
    stiffness = 40,
    damping = 30,
    duration = 2,
  } = transition

  const transitionConfig = type === 'spring' 
    ? { type: 'spring', stiffness, damping, mass: 1 }
    : { type: 'tween', duration, ease: 'linear' }

  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        background: `conic-gradient(
          from 0deg,
          transparent 0deg,
          currentColor 45deg,
          transparent 90deg
        )`,
        width: size,
        height: size,
        borderRadius: '50%',
      }}
      animate={{
        rotate: 360,
      }}
      transition={{
        ...transitionConfig,
        repeat: Infinity,
        repeatType: 'loop',
      }}
      initial={{ rotate: 0, x: initialOffset, y: initialOffset }}
    />
  )
}
