'use server'

import { FileTree } from '@/app/components/ui/file-tree'
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
    <FileTree
      files={files}
      selectedFiles={[]}
      onSelectionChange={handleSelectionChange}
    />
  )
}
