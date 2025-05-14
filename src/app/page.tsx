'use server'

import { FileTree } from '@/app/components/ui/file-tree'
import { FileCard } from '@/app/components/ui/file-card'
import { Textarea } from '@/app/components/ui/textarea'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

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

class Repository {
  constructor(public pathOrUrl: string) {}

  async getFileTree() {
    try {
      const { stdout } = await execAsync(`kit get-file-tree ${this.pathOrUrl}`)
      return JSON.parse(stdout)
    } catch (error) {
      console.error('Error getting file tree:', error)
      return []
    }
  }
}

async function createRepository(pathOrUrl: string) {
  await execAsync(`kit create-repository ${pathOrUrl}`)
  return new Repository(pathOrUrl)
}

async function getFileTree(pathOrUrl: string) {
  try {
    const repository = await createRepository(pathOrUrl)
    const fileTree = await repository.getFileTree()
    return fileTree
  } catch (error) {
    console.error('Error getting file tree:', error)
    return []
  }
}

export default async function Home() {
  const files = await getFileTree('https://github.com/possibilities/dotfiles')

  return (
    <div className='flex h-screen w-full'>
      <div className='w-1/4 h-full overflow-y-auto overflow-x-clip border-r border-[var(--border)] p-2'>
        <div className="w-full">
          <FileTree
            files={files}
            selectedFiles={[]}
            onSelectionChange={handleSelectionChange}
            onExpansionChange={handleExpansionChange}
          />
        </div>
      </div>

      <div className='w-3/4 h-full flex flex-col'>
        <div className='h-1/2 border-b border-[var(--border)] p-4'>
          <Textarea
            className='w-full h-full resize-none'
            placeholder='Enter text here...'
          />
        </div>

        <div className='h-1/2 p-4 overflow-y-auto'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            <FileCard fileName='document.pdf' />
            <FileCard fileName='image.png' />
            <FileCard fileName='spreadsheet.xlsx' />
            <FileCard fileName='presentation.pptx' />
            <FileCard fileName='source.js' />
            <FileCard fileName='styles.css' />
            <FileCard fileName='config.json' />
          </div>
        </div>
      </div>
    </div>
  )
}
