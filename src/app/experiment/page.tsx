import { FileTree } from '@/app/components/ui/file-tree'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function testAction() {
  'use server'
  console.log('Test action triggered')
}

async function getFileTree() {
  try {
    await execAsync(
      'kit create-repository https://github.com/possibilities/dotfiles',
    )
    const { stdout } = await execAsync(
      'kit get-file-tree https://github.com/possibilities/dotfiles',
    )
    return JSON.parse(stdout)
  } catch (error) {
    console.error('Error getting file tree:', error)
    return []
  }
}

export default async function Home() {
  const files = await getFileTree()

  return (
    <FileTree
      files={files}
      selectedFiles={[]}
      onSelectedFilesChange={testAction}
    />
  )
}
