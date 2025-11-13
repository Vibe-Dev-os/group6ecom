'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Improved visibility with better colors and contrast
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Unchecked state - gray background with visible border
        'data-[state=unchecked]:bg-gray-200 data-[state=unchecked]:border-gray-300',
        'dark:data-[state=unchecked]:bg-gray-700 dark:data-[state=unchecked]:border-gray-600',
        // Checked state - blue/primary background
        'data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600',
        'dark:data-[state=checked]:bg-blue-500 dark:data-[state=checked]:border-blue-500',
        // Hover states for better interaction feedback
        'hover:data-[state=unchecked]:bg-gray-300 hover:data-[state=checked]:bg-blue-700',
        'dark:hover:data-[state=unchecked]:bg-gray-600 dark:hover:data-[state=checked]:bg-blue-400',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform',
          // Unchecked state - white thumb on the left
          'data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-white',
          // Checked state - white thumb on the right
          'data-[state=checked]:translate-x-5 data-[state=checked]:bg-white',
          // Dark mode adjustments
          'dark:data-[state=unchecked]:bg-gray-100 dark:data-[state=checked]:bg-white'
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
