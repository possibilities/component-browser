'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { Check, ChevronDown, ChevronRight, File, Folder } from 'lucide-react'
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
  selectedFiles?: string[]
  onSelectionChange?: (addedFiles: string[], removedFiles: string[]) => void
}

type TreeNode = {
  item: FileItem
  children: TreeNode[]
  parent: TreeNode | null
  selected: boolean
  indeterminate: boolean
}

// Update node states (selected and indeterminate)
const updateSelectionsRecursively = function processNode(node: TreeNode): {
  selected: number
  total: number
} {
  if (node.children.length === 0) {
    // Leaf node
    return { selected: node.selected ? 1 : 0, total: 1 }
  }

  // Process children first (use named function for recursion)
  const counts = node.children.map(processNode)
  const selectedCount = counts.reduce((sum, count) => sum + count.selected, 0)
  const totalCount = counts.reduce((sum, count) => sum + count.total, 0)

  // Update this node's state
  node.selected = selectedCount === totalCount && totalCount > 0
  node.indeterminate = selectedCount > 0 && selectedCount < totalCount

  return { selected: selectedCount, total: totalCount }
}

// Sort children alphabetically for each node
const sortNodesAlphabetically = (node: TreeNode) => {
  // Sort directories first, then files, both alphabetically by name
  node.children.sort((a, b) => {
    // If one is a directory and the other is not, directories come first
    if (a.item.is_dir && !b.item.is_dir) return -1
    if (!a.item.is_dir && b.item.is_dir) return 1

    // Otherwise sort alphabetically by name
    return a.item.name.localeCompare(b.item.name)
  })

  // Recursively sort children
  node.children.forEach(sortNodesAlphabetically)
}

export function FileTree({
  files,
  selectedFiles = [],
  onSelectionChange,
}: FileTreeProps) {
  const [tree, setTree] = useState<TreeNode | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [prevSelectedFiles, setPrevSelectedFiles] =
    useState<string[]>(selectedFiles)

  // Build tree from flat file list and apply selection state
  useEffect(() => {
    const buildTree = () => {
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

      // Sort files to ensure parents come before children
      const sortedFiles = [...files].sort((a, b) => {
        const aDepth = a.path.split('/').length
        const bDepth = b.path.split('/').length
        return aDepth - bDepth
      })

      // Create nodes for each file
      sortedFiles.forEach(file => {
        // Check if file is selected based on selectedFiles prop
        const isSelected = selectedFiles.includes(file.path)

        const node: TreeNode = {
          item: { ...file },
          children: [],
          parent: null,
          selected: isSelected,
          indeterminate: false,
        }
        nodeMap.set(file.path, node)

        // Find parent
        if (file.is_dir === false) {
          // For files, parent is the directory containing it
          const parentPath = file.path.substring(0, file.path.lastIndexOf('/'))
          const parent = nodeMap.get(parentPath || '')
          if (parent) {
            node.parent = parent
            parent.children.push(node)
          } else {
            root.children.push(node)
          }
        } else {
          // For directories, parent is the directory containing it
          const pathParts = file.path.split('/')
          pathParts.pop() // Remove the directory name itself
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

      updateSelectionsRecursively(root)
      sortNodesAlphabetically(root)

      return root
    }

    setTree(buildTree())
  }, [files, selectedFiles])

  // Toggle selection of a node
  const toggleNode = (node: TreeNode) => {
    // When a node is in indeterminate state, always deselect it
    const newSelected = node.indeterminate ? false : !node.selected

    // Update this node and all its children
    const updateSelection = (n: TreeNode) => {
      n.selected = newSelected
      n.indeterminate = false
      n.children.forEach(updateSelection)
    }

    updateSelection(node)

    // Update parents
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

    // Create a new tree to trigger re-render
    setTree({ ...tree! })

    // Call onSelectionChange with added and removed files
    if (onSelectionChange) {
      const currentSelectedFiles = getSelectedFiles(tree!)

      // Find newly added files (present in current but not in previous)
      const addedFiles = currentSelectedFiles.filter(
        path => !prevSelectedFiles.includes(path),
      )

      // Find newly removed files (present in previous but not in current)
      const removedFiles = prevSelectedFiles.filter(
        path => !currentSelectedFiles.includes(path),
      )

      // Update previous selected files for next comparison
      setPrevSelectedFiles(currentSelectedFiles)

      // Only call if there are changes
      if (addedFiles.length > 0 || removedFiles.length > 0) {
        onSelectionChange(addedFiles, removedFiles)
      }
    }
  }

  // Get all selected files from the tree
  const getSelectedFiles = (node: TreeNode): string[] => {
    let selectedFiles: string[] = []

    // Only include non-directory items in the selection list
    if (node.item.path && node.selected && !node.item.is_dir) {
      selectedFiles.push(node.item.path)
    }

    // Include selected files from children
    node.children.forEach(child => {
      selectedFiles = selectedFiles.concat(getSelectedFiles(child))
    })

    return selectedFiles
  }

  // Toggle folder expansion
  const toggleFolderExpansion = (path: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering checkbox toggle

    const newExpandedFolders = new Set(expandedFolders)

    if (newExpandedFolders.has(path)) {
      newExpandedFolders.delete(path)
    } else {
      newExpandedFolders.add(path)
    }

    setExpandedFolders(newExpandedFolders)
  }

  // Render a node and its children
  const renderNode = (node: TreeNode, level = 0) => {
    if (!node.item.path && level === 0) {
      // Root node, just render children
      return (
        <div className='space-y-1'>
          {node.children.map(child => renderNode(child, level))}
        </div>
      )
    }

    const isExpanded = node.item.is_dir
      ? expandedFolders.has(node.item.path)
      : false

    return (
      <div key={node.item.path} className='select-none'>
        <div
          className={
            'flex items-center py-1 px-1 hover:bg-muted rounded-md outline-none overflow-hidden'
          }
          tabIndex={0}
        >
          {/* Caret - fixed width */}
          <div className='w-5 mr-2 flex-shrink-0 flex items-center justify-center'>
            {node.item.is_dir && (
              <button
                type='button'
                className='w-5 h-5 flex items-center justify-center text-muted-foreground outline-none focus:outline-none'
                aria-label={`Toggle ${node.item.name}`}
                onClick={e => {
                  e.stopPropagation() // Prevent checkbox toggle
                  toggleFolderExpansion(node.item.path, e)
                }}
              >
                {node.children.length > 0 ? (
                  isExpanded ? (
                    <ChevronDown className='h-4 w-4' />
                  ) : (
                    <ChevronRight className='h-4 w-4' />
                  )
                ) : (
                  <ChevronRight className='h-4 w-4 opacity-0' />
                )}
              </button>
            )}
          </div>

          <div className='flex items-center gap-2'>
            {/* Checkbox - fixed width/height */}
            <div
              className='w-5 flex justify-center flex-shrink-0 cursor-pointer'
              onClick={() => toggleNode(node)}
            >
              <div
                className={cn(
                  'w-4 h-4 min-w-[16px] min-h-[16px] border rounded-sm flex items-center justify-center outline-none',
                  node.selected
                    ? 'bg-primary border-primary'
                    : 'border-input bg-background',
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

            {/* Icon and filename */}
            {node.item.is_dir ? (
              <Folder className='h-4 w-5 flex-shrink-0 text-muted-foreground' />
            ) : (
              <File className='h-4 w-5 flex-shrink-0 text-muted-foreground' />
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
