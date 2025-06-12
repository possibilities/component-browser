import Link from 'next/link'
import { FolderTree, CheckSquare } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { ArtHackIcon } from '@/components/icons/arthack-icon'

const components = [
  {
    href: '/file-tree',
    title: 'File Tree',
    description: 'Hierarchical file browser with selection',
    icon: FolderTree,
  },
  {
    href: '/checkbox',
    title: 'Checkbox',
    description: 'Checkbox with indeterminate state',
    icon: CheckSquare,
  },
]

export default function Home() {
  return (
    <div className='h-screen w-full flex flex-col'>
      <header className='flex items-center justify-end px-6 py-4'>
        <ThemeToggle />
      </header>
      <div className='flex-1 flex items-center justify-center p-6'>
        <div className='w-full max-w-2xl'>
          <div className='text-center mb-6'>
            <h1 className='text-4xl font-bold mb-4 flex items-center justify-center gap-4'>
              <ArtHackIcon className='w-10 h-10' />
              ArtHack UI
            </h1>
            <p className='text-lg text-muted-foreground'>
              <i>&gt; some components that make me happy</i>
            </p>
          </div>
          <div className='flex flex-col gap-3'>
            {components.map(component => {
              const Icon = component.icon
              return (
                <Link
                  key={component.href}
                  href={component.href}
                  className='group relative overflow-hidden rounded-lg border bg-card p-6 hover:shadow-lg transition-all duration-200 hover:translate-x-1'
                >
                  <div className='flex items-center gap-4'>
                    <div className='rounded-md border p-2 bg-muted/50 group-hover:bg-primary/10 transition-colors'>
                      <Icon className='h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors' />
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-semibold mb-1 group-hover:text-primary transition-colors'>
                        {component.title}
                      </h3>
                      <p className='text-sm text-muted-foreground'>
                        {component.description}
                      </p>
                    </div>
                  </div>
                  <div className='absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary/0 via-primary to-primary/0 -translate-x-full group-hover:translate-x-0 transition-transform duration-200' />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
