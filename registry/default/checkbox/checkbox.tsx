'use client'

import { Check } from 'lucide-react'
import { cn } from '@/registry/default/lib/utils'

type CheckboxProps = {
  checked: boolean
  indeterminate?: boolean
  onChange?: () => void
  className?: string
}

export function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  className,
}: CheckboxProps) {
  return (
    <div
      className={cn(
        'w-4 h-4 min-w-[16px] min-h-[16px] border rounded-sm flex items-center justify-center outline-none cursor-pointer',
        checked || indeterminate
          ? 'bg-primary border-primary'
          : 'border-input bg-background',
        !checked && !indeterminate && 'hover:bg-muted',
        className,
      )}
      onClick={onChange}
    >
      {checked && !indeterminate && (
        <Check className='h-3 w-3 text-primary-foreground' />
      )}
      {indeterminate && <div className='w-2 h-px bg-primary-foreground' />}
    </div>
  )
}