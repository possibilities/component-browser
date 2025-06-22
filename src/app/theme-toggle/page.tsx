'use client'

import { ThemeToggle } from '@/registry/default/theme-toggle/theme-toggle'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ArtHackIcon } from '@/components/icons/arthack-icon'
import { InstallationCode } from '@/components/installation-code'
import { REGISTRY_URL } from '@/lib/config'

export default function ThemeToggleDemo() {
  const installCommand = `pnpm dlx shadcn@latest add ${REGISTRY_URL}/r/theme-toggle.json`

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
              <BreadcrumbPage>Theme Toggle</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ThemeToggle />
      </header>
      <div className='flex-1 overflow-y-auto p-6'>
        <div className='max-w-2xl mx-auto'>
          <div className='mb-6'>
            <h1 className='text-3xl font-bold mb-2'>Theme Toggle</h1>
          </div>

          <div className='mb-12'>
            <div className='flex items-center justify-center p-16 border rounded-lg bg-card'>
              <ThemeToggle />
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
