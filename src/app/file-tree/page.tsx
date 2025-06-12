'use client'

import { useState } from 'react'
import { FileTree } from '@/components/ui/file-tree'
import { ThemeToggle } from '@/components/theme-toggle'
import testFiles from '@/data/test-files.json'

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [expandedFiles, setExpandedFiles] = useState<string[]>([])

  const handleSelectionChange = (
    addedFiles: string[],
    removedFiles: string[],
  ) => {
    setSelectedFiles(prevSelected => {
      const newSelected = [...prevSelected]

      removedFiles.forEach(file => {
        const index = newSelected.indexOf(file)
        if (index > -1) {
          newSelected.splice(index, 1)
        }
      })

      addedFiles.forEach(file => {
        if (!newSelected.includes(file)) {
          newSelected.push(file)
        }
      })

      return newSelected
    })
  }

  const handleExpansionChange = (
    expandedFilesParam: string[],
    contractedFiles: string[],
  ) => {
    setExpandedFiles(prevExpanded => {
      const newExpanded = [...prevExpanded]

      contractedFiles.forEach(file => {
        const index = newExpanded.indexOf(file)
        if (index > -1) {
          newExpanded.splice(index, 1)
        }
      })

      expandedFilesParam.forEach(file => {
        if (!newExpanded.includes(file)) {
          newExpanded.push(file)
        }
      })

      return newExpanded
    })
  }

  return (
    <div className='h-screen w-full flex flex-col'>
      <header className='flex items-center justify-between px-6 py-4 border-b'>
        <h1 className='text-2xl font-semibold'>File Tree</h1>
        <ThemeToggle />
      </header>
      <div className='flex-1 overflow-y-auto p-6'>
        <div className='max-w-md mx-auto'>
          <FileTree
            files={testFiles}
            selectedFiles={selectedFiles}
            expandedFiles={expandedFiles}
            onSelectionChange={handleSelectionChange}
            onExpansionChange={handleExpansionChange}
          />
        </div>
      </div>
    </div>
  )
}
