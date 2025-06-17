'use client'

import { Circle, CircleDot } from 'lucide-react'
import { cn } from '@/registry/default/lib/utils'

type RadioProps = {
  checked: boolean
  onChange?: () => void
  className?: string
}

export function Radio({ checked, onChange, className }: RadioProps) {
  return (
    <div
      className={cn(
        'w-4 h-4 min-w-[16px] min-h-[16px] rounded-full flex items-center justify-center outline-none cursor-pointer relative',
        'transition-colors duration-200',
        checked ? 'text-primary' : 'text-input',
        !checked && 'hover:text-muted-foreground',
        className,
      )}
      onClick={onChange}
    >
      <Circle className='h-4 w-4 absolute' />
      {checked && <CircleDot className='h-4 w-4 absolute' />}
    </div>
  )
}