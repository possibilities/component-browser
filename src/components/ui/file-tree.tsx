'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { ChevronRight, File, Folder } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

type FileTreeProps = {
  files: string[]
  selectedFiles: string[]
  expandedFiles: string[]
  onSelectionChange: (addedFiles: string[], removedFiles: string[]) => void
  onExpansionChange: (
    expandedFiles: string[],
    contractedFiles: string[],
  ) => void
}

type TreeNode = {
  path: string
  isDir: boolean
  children: TreeNode[]
  parent: TreeNode | null
  selected: boolean
  indeterminate: boolean
}

function getNameFromPath(path: string): string {
  if (!path) return 'root'
  const segments = path.split('/')
  return segments[segments.length - 1]
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
    if (a.isDir && !b.isDir) return -1
    if (!a.isDir && b.isDir) return 1

    return 0
  })

  node.children.forEach(sortNodesFoldersFirst)
}

function buildTree(files: string[], selectedFiles: string[]) {
  const root: TreeNode = {
    path: '',
    isDir: true,
    children: [],
    parent: null,
    selected: false,
    indeterminate: false,
  }

  const nodeMap = new Map<string, TreeNode>()
  nodeMap.set('', root)

  const pathSet = new Set(files)

  const sortedPaths = [...files].sort((a, b) => {
    const aDepth = a.split('/').length
    const bDepth = b.split('/').length
    return aDepth - bDepth
  })

  sortedPaths.forEach(path => {
    const isDir = files.some(
      otherPath => otherPath !== path && otherPath.startsWith(path + '/'),
    )

    const isSelected = selectedFiles.includes(path)

    const node: TreeNode = {
      path,
      isDir,
      children: [],
      parent: null,
      selected: isSelected,
      indeterminate: false,
    }
    nodeMap.set(path, node)

    const segments = path.split('/')
    segments.pop()
    const parentPath = segments.join('/')

    const parent = nodeMap.get(parentPath || '')
    if (parent) {
      node.parent = parent
      parent.children.push(node)
    } else {
      let currentPath = ''
      for (let i = 0; i < segments.length; i++) {
        currentPath = segments.slice(0, i + 1).join('/')
        if (!nodeMap.has(currentPath)) {
          const intermediateNode: TreeNode = {
            path: currentPath,
            isDir: true,
            children: [],
            parent: nodeMap.get(segments.slice(0, i).join('/') || '') || root,
            selected: false,
            indeterminate: false,
          }
          nodeMap.set(currentPath, intermediateNode)
          intermediateNode.parent!.children.push(intermediateNode)
        }
      }

      const directParent = nodeMap.get(parentPath)
      if (directParent) {
        node.parent = directParent
        directParent.children.push(node)
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

    if (node.path && node.selected && !node.isDir) {
      selectedFiles.push(node.path)
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
    if (!node.path && level === 0) {
      return (
        <div className='space-y-1'>
          {node.children.map(child => renderNode(child, level))}
        </div>
      )
    }

    const isExpanded = node.isDir ? expandedFiles.includes(node.path) : false

    return (
      <div key={node.path} className='select-none'>
        <div
          className={
            'flex items-center py-1 px-1 rounded-md outline-none max-w-full'
          }
          tabIndex={0}
        >
          <div className='w-5 mr-1 flex-shrink-0 flex items-center justify-center'>
            {node.isDir && (
              <button
                type='button'
                className='w-5 h-5 flex items-center justify-center text-muted-foreground outline-none focus:outline-none'
                aria-label={`Toggle ${getNameFromPath(node.path)}`}
                onClick={e => toggleFolderExpansion(node.path, e)}
              >
                {node.children.length > 0 ? (
                  <ChevronRight
                    className={`h-4 w-4 ${isExpanded ? 'rotate-90' : ''}`}
                  />
                ) : (
                  <ChevronRight className='h-4 w-4 opacity-0' />
                )}
              </button>
            )}
          </div>

          <div className='flex items-center gap-3'>
            <div className='w-5 flex-shrink-0 flex justify-center'>
              <Checkbox
                checked={node.selected}
                indeterminate={node.indeterminate}
                onChange={() => toggleNode(node)}
              />
            </div>

            {node.isDir ? (
              <Folder className='h-4 w-4 flex-shrink-0 text-muted-foreground' />
            ) : (
              <File className='h-4 w-4 flex-shrink-0 text-muted-foreground' />
            )}
            <span className='truncate'>{getNameFromPath(node.path)}</span>
          </div>
        </div>

        {node.isDir && node.children.length > 0 && isExpanded && (
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
