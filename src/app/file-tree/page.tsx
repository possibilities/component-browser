'use client'

import { useState } from 'react'
import { FileTree } from '@/registry/default/file-tree/file-tree'
import { ThemeToggle } from '@/registry/default/theme-toggle/theme-toggle'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import fileTreeData from '@/data/file-tree.json'
import { ArtHackIcon } from '@/components/icons/arthack-icon'
import { InstallationCode } from '@/components/installation-code'
import { REGISTRY_URL } from '@/lib/config'

export default function FileTreeDemo() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [expandedFiles, setExpandedFiles] = useState<string[]>([])
  const installCommand = `pnpm dlx shadcn@latest add ${REGISTRY_URL}/r/file-tree.json`

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
        <Breadcrumb>
          <BreadcrumbList className='text-xl'>
            <BreadcrumbItem>
              <BreadcrumbLink href='/' className='flex items-center gap-3'>
                <ArtHackIcon className='h-5 w-5' />
                ArtHack UI
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>File Tree</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ThemeToggle />
      </header>
      <div className='flex-1 overflow-y-auto p-6'>
        <div className='max-w-2xl mx-auto'>
          <div className='mb-6'>
            <h1 className='text-3xl font-bold mb-2'>File Tree</h1>
          </div>

          <div className='mb-12'>
            <div className='flex items-center justify-center p-16 border rounded-lg bg-card'>
              <FileTree
                files={fileTreeData}
                selectedFiles={selectedFiles}
                expandedFiles={expandedFiles}
                onSelectionChange={handleSelectionChange}
                onExpansionChange={handleExpansionChange}
              />
            </div>
          </div>

          <section>
            <InstallationCode command={installCommand} />
          </section>
        </div>
      </div>
    </div>
  )
}
