#!/usr/bin/env node

const { exec } = require('child_process')
const { promisify } = require('util')
const fs = require('fs').promises
const path = require('path')

const execAsync = promisify(exec)

async function createRepository(pathOrUrl) {
  await execAsync(`kit create-repository ${pathOrUrl}`)
}

async function getFileTree(pathOrUrl) {
  try {
    await createRepository(pathOrUrl)
    const { stdout } = await execAsync(`kit get-file-tree ${pathOrUrl}`, {
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    })
    return JSON.parse(stdout)
  } catch (error) {
    console.error('Error getting file tree:', error)
    return []
  }
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error('Usage: npm run get-test-files <github-user/repo>')
    console.error('Example: npm run get-test-files rails/rails')
    process.exit(1)
  }

  const repoPath = args[0]
  const githubUrl = `https://github.com/${repoPath}`

  console.log(`Fetching file tree for ${githubUrl}...`)

  const fileTree = await getFileTree(githubUrl)

  if (fileTree.length === 0) {
    console.error('Failed to fetch file tree')
    process.exit(1)
  }

  // Extract only the paths as an array of strings
  const paths = fileTree.map(item => item.path)

  const outputDir = path.join(__dirname, '..', 'src', 'data')
  const outputFile = path.join(outputDir, 'test-files.json')

  await fs.mkdir(outputDir, { recursive: true })

  await fs.writeFile(outputFile, JSON.stringify(paths, null, 2))

  console.log(`File tree saved to ${outputFile}`)
  console.log(`Total files: ${fileTree.length}`)
}

main().catch(error => {
  console.error('Error:', error)
  process.exit(1)
})