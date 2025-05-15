import * as React from 'react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/card'
import { FileIcon } from 'lucide-react'

interface FileCardProps {
  fileName: string
  fileSize: string
  fileSizePercent: string
}

export function FileCard({
  fileName,
  fileSize,
  fileSizePercent,
}: FileCardProps) {
  return (
    <Card className='hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] cursor-pointer transition-colors'>
      <CardHeader className='flex flex-row items-start gap-2 p-4'>
        <FileIcon className='h-4 w-4 mt-0.5' />
        <div className='text-sm font-medium truncate'>{fileName}</div>
      </CardHeader>
      <CardContent className='px-4 pb-4 pt-0'>
        <div className='text-xs text-[var(--muted-foreground)]'>
          {fileSize} ({fileSizePercent})
        </div>
      </CardContent>
    </Card>
  )
}
