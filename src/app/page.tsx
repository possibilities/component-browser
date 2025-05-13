'use client'

import { useState } from 'react'
import { FileTree } from '@/app/components/ui/file-tree'

// Example data
const initialFiles = [
  {
    path: 'eslint.config.mjs',
    is_dir: false,
    name: 'eslint.config.mjs',
    size: 393,
  },
  {
    path: 'tsconfig.json',
    is_dir: false,
    name: 'tsconfig.json',
    size: 602,
  },
  {
    path: 'components.json',
    is_dir: false,
    name: 'components.json',
    size: 431,
  },
  {
    path: 'package.json',
    is_dir: false,
    name: 'package.json',
    size: 1108,
  },
  {
    path: '.claude',
    is_dir: true,
    name: '.claude',
    size: 0,
  },
  {
    path: 'next.config.ts',
    is_dir: false,
    name: 'next.config.ts',
    size: 130,
  },
  {
    path: 'src',
    is_dir: true,
    name: 'src',
    size: 0,
  },
  {
    path: '.gitignore',
    is_dir: false,
    name: '.gitignore',
    size: 106,
  },
  {
    path: 'postcss.config.mjs',
    is_dir: false,
    name: 'postcss.config.mjs',
    size: 94,
  },
  {
    path: 'src/lib',
    is_dir: true,
    name: 'lib',
    size: 0,
  },
  {
    path: 'src/app',
    is_dir: true,
    name: 'app',
    size: 0,
  },
  {
    path: 'src/lib/utils.ts',
    is_dir: false,
    name: 'utils.ts',
    size: 166,
  },
  {
    path: 'src/lib/theme-provider.tsx',
    is_dir: false,
    name: 'theme-provider.tsx',
    size: 400,
  },
  {
    path: 'src/app/layout.tsx',
    is_dir: false,
    name: 'layout.tsx',
    size: 482,
  },
  {
    path: 'src/app/globals.css',
    is_dir: false,
    name: 'globals.css',
    size: 7770,
  },
  {
    path: 'src/app/page.tsx',
    is_dir: false,
    name: 'page.tsx',
    size: 195,
  },
]

export default function Home() {
  const [files, setFiles] = useState(initialFiles)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([
    'tsconfig.json',
    'src/lib/utils.ts',
  ])

  const handleFilesChange = (updatedFiles: any[]) => {
    setFiles(updatedFiles)
    console.log('Updated files:', updatedFiles)
  }

  const handleSelectedFilesChange = (updatedSelectedFiles: string[]) => {
    setSelectedFiles(updatedSelectedFiles)
    console.log('Selected files:', updatedSelectedFiles)
  }

  return (
    <FileTree
      files={files}
      selectedFiles={selectedFiles}
      onFilesChange={handleFilesChange}
      onSelectedFilesChange={handleSelectedFilesChange}
    />
  )
}
