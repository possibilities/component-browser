'use server'

import { FileTree } from '@/components/file-tree'
import { ThemeToggle } from '@/components/theme-toggle'
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
