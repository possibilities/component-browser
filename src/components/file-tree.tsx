'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { Check, ChevronRight, File, Folder } from 'lucide-react'
import { cn } from '@/lib/utils'

type FileItem = {
  path: string
  is_dir: boolean
  name: string
  size: number
  selected?: boolean
}

type FileTreeProps = {
  files: FileItem[]
  selectedFiles: string[]
  expandedFiles: string[]
  onSelectionChange: (addedFiles: string[], removedFiles: string[]) => void
  onExpansionChange: (
    expandedFiles: string[],
    contractedFiles: string[],
  ) => void
}

type TreeNode = {
  item: FileItem
  children: TreeNode[]
  parent: TreeNode | null
  selected: boolean
  indeterminate: boolean
}

function updateSelectionsRecursively(node: TreeNode): {
  selected: number
  total: number
} {
  if (node.children.length === 0) {
    return { selected: node.selected ? 1 : 0, total: 1 }
  }

  const counts = node.children.map(updateSelectionsRecursively)
  const selectedCount = counts.reduce((sum, count) => sum + count.selected, 0)
  const totalCount = counts.reduce((sum, count) => sum + count.total, 0)

  node.selected = selectedCount === totalCount && totalCount > 0
  node.indeterminate = selectedCount > 0 && selectedCount < totalCount
  return { selected: selectedCount, total: totalCount }
}

function sortNodesFoldersFirst(node: TreeNode) {
  node.children.sort((a, b) => {
    if (a.item.is_dir && !b.item.is_dir) return -1
    if (!a.item.is_dir && b.item.is_dir) return 1

    return 0
  })

  node.children.forEach(sortNodesFoldersFirst)
}

function buildTree(files: FileItem[], selectedFiles: string[]) {
  const root: TreeNode = {
    item: {
      path: '',
      is_dir: true,
      name: 'root',
      size: 0,
    },
    children: [],
    parent: null,
    selected: false,
    indeterminate: false,
  }

  const nodeMap = new Map<string, TreeNode>()
  nodeMap.set('', root)

  const sortedFiles = [...files].sort((a, b) => {
    const aDepth = a.path.split('/').length
    const bDepth = b.path.split('/').length
    return aDepth - bDepth
  })

  sortedFiles.forEach(file => {
    const isSelected = selectedFiles.includes(file.path)

    const node: TreeNode = {
      item: { ...file },
      children: [],
      parent: null,
      selected: isSelected,
      indeterminate: false,
    }
    nodeMap.set(file.path, node)

    if (file.is_dir === false) {
      const parentPath = file.path.substring(0, file.path.lastIndexOf('/'))
      const parent = nodeMap.get(parentPath || '')
      if (parent) {
        node.parent = parent
        parent.children.push(node)
      } else {
        root.children.push(node)
      }
    } else {
      const pathParts = file.path.split('/')
      pathParts.pop()
      const parentPath = pathParts.join('/')
      const parent = nodeMap.get(parentPath || '')
      if (parent) {
        node.parent = parent
        parent.children.push(node)
      } else {
        root.children.push(node)
      }
    }
  })

  return root
}

export function FileTree({
  files,
  selectedFiles,
  expandedFiles,
  onSelectionChange,
  onExpansionChange,
}: FileTreeProps) {
  const [tree, setTree] = useState<TreeNode | null>(null)

  useEffect(() => {
    const tree = buildTree(files, selectedFiles)
    updateSelectionsRecursively(tree)
    sortNodesFoldersFirst(tree)
    setTree(tree)
  }, [files, selectedFiles])

  const toggleNode = (node: TreeNode) => {
    const newSelected = node.indeterminate ? false : !node.selected

    const updateSelection = (n: TreeNode) => {
      n.selected = newSelected
      n.indeterminate = false
      n.children.forEach(updateSelection)
    }

    updateSelection(node)

    let parent = node.parent
    while (parent) {
      const childStats = parent.children.reduce(
        (stats, child) => ({
          selected: stats.selected + (child.selected ? 1 : 0),
          total: stats.total + 1,
        }),
        { selected: 0, total: 0 },
      )

      parent.selected = childStats.selected === childStats.total
      parent.indeterminate =
        childStats.selected > 0 && childStats.selected < childStats.total

      parent = parent.parent
    }

    setTree({ ...tree! })

    const currentSelectedFiles = getSelectedFiles(tree!)

    const addedFiles = currentSelectedFiles.filter(
      path => !selectedFiles.includes(path),
    )

    const removedFiles = selectedFiles.filter(
      path => !currentSelectedFiles.includes(path),
    )

    if (addedFiles.length > 0 || removedFiles.length > 0) {
      onSelectionChange(addedFiles, removedFiles)
    }
  }

  const getSelectedFiles = (node: TreeNode): string[] => {
    let selectedFiles: string[] = []

    if (node.item.path && node.selected && !node.item.is_dir) {
      selectedFiles.push(node.item.path)
    }

    node.children.forEach(child => {
      selectedFiles = selectedFiles.concat(getSelectedFiles(child))
    })

    return selectedFiles
  }

  const toggleFolderExpansion = (path: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (expandedFiles.includes(path)) {
      onExpansionChange([], [path])
    } else {
      onExpansionChange([path], [])
    }
  }

  const renderNode = (node: TreeNode, level = 0) => {
    if (!node.item.path && level === 0) {
      return (
        <div className='space-y-1'>
          {node.children.map(child => renderNode(child, level))}
        </div>
      )
    }

    const isExpanded = node.item.is_dir
      ? expandedFiles.includes(node.item.path)
      : false

    return (
      <div key={node.item.path} className='select-none'>
        <div
          className={
            'flex items-center py-1 px-1 rounded-md outline-none max-w-full'
          }
          tabIndex={0}
        >
          <div className='w-5 mr-1 flex-shrink-0 flex items-center justify-center'>
            {node.item.is_dir && (
              <button
                type='button'
                className='w-5 h-5 flex items-center justify-center text-muted-foreground outline-none focus:outline-none'
                aria-label={`Toggle ${node.item.name}`}
                onClick={e => toggleFolderExpansion(node.item.path, e)}
              >
                {node.children.length > 0 ? (
                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                ) : (
                  <ChevronRight className='h-4 w-4 opacity-0' />
                )}
              </button>
            )}
          </div>

          <div className='flex items-center gap-3'>
            <div
              className='w-5 flex-shrink-0 flex justify-center'
              onClick={() => toggleNode(node)}
            >
              <div
                className={cn(
                  'w-4 h-4 min-w-[16px] min-h-[16px] border rounded-sm flex items-center justify-center outline-none',
                  node.selected
                    ? 'bg-primary border-primary'
                    : 'border-input bg-background',
                  node.selected || 'hover:bg-muted',
                  node.indeterminate && 'bg-primary border-primary',
                )}
              >
                {node.selected && !node.indeterminate && (
                  <Check className='h-3 w-3 text-primary-foreground' />
                )}
                {node.indeterminate && (
                  <div className='w-2 h-px bg-primary-foreground' />
                )}
              </div>
            </div>

            {node.item.is_dir ? (
              <Folder className='h-4 w-4 flex-shrink-0 text-muted-foreground' />
            ) : (
              <File className='h-4 w-4 flex-shrink-0 text-muted-foreground' />
            )}
            <span className='truncate'>{node.item.name}</span>
          </div>
        </div>

        {node.item.is_dir && node.children.length > 0 && isExpanded && (
          <div className='ml-4.75 space-y-1'>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (!tree) {
    return null
  }

  return renderNode(tree)
}
