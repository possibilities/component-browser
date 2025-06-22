'use client'

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
        'w-4 h-4 min-w-[16px] min-h-[16px] rounded-full flex items-center justify-center outline-none cursor-pointer',
        checked
          ? 'bg-transparent border-2 border-muted-foreground'
          : 'border border-input bg-background',
        !checked && 'hover:bg-muted',
        className,
      )}
      onClick={onChange}
    >
      {checked && (
        <div className='w-2.5 h-2.5 rounded-full bg-white' />
      )}
    </div>
  )
}