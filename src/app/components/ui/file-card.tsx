import * as React from "react"
import { Card, CardContent, CardHeader } from "./card"
import { FileIcon } from "lucide-react"

interface FileCardProps {
  fileName: string
}

export function FileCard({ fileName }: FileCardProps) {
  return (
    <Card className="hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] cursor-pointer transition-colors">
      <CardHeader className="flex flex-row items-start gap-2 p-4">
        <FileIcon className="h-4 w-4 mt-0.5" />
        <div className="text-sm font-medium truncate">{fileName}</div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="text-xs text-[var(--muted-foreground)]">
          File type: {fileName.split('.').pop()}
        </div>
      </CardContent>
    </Card>
  )
}