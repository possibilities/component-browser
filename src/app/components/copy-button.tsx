'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'

interface CopyButtonProps {
  className?: string
}

export function CopyButton({ className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    // Get text from textarea
    const textarea = document.querySelector('textarea')
    if (textarea) {
      const text = textarea.value
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
        .catch(err => {
          console.error('Failed to copy text: ', err)
        })
    }
  }

  // className={`px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-md hover:bg-primary/90 transition-colors ${className}`}
  return (
    <Button variant='outline' className={className} onClick={handleCopy}>
      {copied ? 'Copied!' : 'Copy Prompt'}
    </Button>
  )
}
