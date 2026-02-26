"use client"

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-pill px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-darkBlue animate-pulseGlow',
        secondary: 'bg-white text-primary border border-primary hover:bg-lightBlue',
        ghost: 'bg-transparent text-textDark hover:bg-lightBlue',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, loading, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={cn(buttonVariants({ variant }), className)}
        {...props}
      >
        {loading ? 'Loading...' : children}
      </motion.button>
    )
  },
)

Button.displayName = 'Button'