'use client'

import { useState } from 'react'
import { FileTree } from '@/components/file-tree'
import { ThemeToggle } from '@/components/theme-toggle'
import testFiles from '@/data/test-files.json'

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const handleSelectionChange = (
    addedFiles: string[],
    removedFiles: string[],
  ) => {
    console.log('Added files:', addedFiles)
    console.log('Removed files:', removedFiles)

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
    expandedFiles: string[],
    contractedFiles: string[],
  ) => {
    console.log('Expanded files:', expandedFiles)
    console.log('Contracted files:', contractedFiles)
  }

  return (
    <div className='h-screen w-full flex flex-col'>
      <header className='flex items-center justify-between px-6 py-4 border-b'>
        <h1 className='text-2xl font-semibold'>File Tree</h1>
        <ThemeToggle />
      </header>
      <div className='flex-1 overflow-y-auto overflow-x-clip p-3'>
        <FileTree
          files={testFiles}
          selectedFiles={selectedFiles}
          onSelectionChange={handleSelectionChange}
          onExpansionChange={handleExpansionChange}
        />
      </div>
    </div>
  )
}
