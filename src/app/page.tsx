'use server'

import { FileTree } from '@/components/file-tree'
import { ThemeToggle } from '@/components/theme-toggle'
import testFiles from '@/data/test-files.json'

async function handleSelectionChange(
  addedFiles: string[],
  removedFiles: string[],
) {
  'use server'
  console.log('Added files:', addedFiles)
  console.log('Removed files:', removedFiles)
}

async function handleExpansionChange(
  expandedFiles: string[],
  contractedFiles: string[],
) {
  'use server'
  console.log('Expanded files:', expandedFiles)
  console.log('Contracted files:', contractedFiles)
}

export default async function Home() {
  const files = testFiles

  return (
    <div className='h-screen w-full flex flex-col'>
      <header className='flex items-center justify-between px-6 py-4 border-b'>
        <h1 className='text-2xl font-semibold'>File Tree</h1>
        <ThemeToggle />
      </header>
      <div className='flex-1 overflow-y-auto overflow-x-clip p-3'>
        <FileTree
          files={files}
          selectedFiles={[]}
          onSelectionChange={handleSelectionChange}
          onExpansionChange={handleExpansionChange}
        />
      </div>
    </div>
  )
}
