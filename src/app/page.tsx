import Link from 'next/link'

export default function Home() {
  return (
    <div className='h-screen w-full flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold mb-4'>Context Composer</h1>
        <p className='text-lg text-muted-foreground mb-8'>
          A tool for composing context for AI
        </p>
        <Link
          href='/file-tree'
          className='inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90'
        >
          Open File Tree
        </Link>
      </div>
    </div>
  )
}
