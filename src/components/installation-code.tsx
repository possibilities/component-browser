'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import styles from './installation-code.module.css'

interface InstallationCodeProps {
  command: string
}

export function InstallationCode({ command }: InstallationCodeProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold'>Installation</h2>
        <Button
          size='icon'
          variant='ghost'
          className='h-8 w-8 text-muted-foreground hover:text-foreground'
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className='h-4 w-4' />
          ) : (
            <Copy className='h-4 w-4' />
          )}
          <span className='sr-only'>Copy installation command</span>
        </Button>
      </div>
      <div className='rounded-lg border bg-muted p-4'>
        <pre
          className={`text-sm text-foreground overflow-x-auto ${styles.scrollContainer}`}
        >
          <code>{command}</code>
        </pre>
      </div>
    </>
  )
}
