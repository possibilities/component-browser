'use client'

import { Checkbox } from '@/registry/default/checkbox/checkbox'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const ArtHackIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    viewBox='100 100 1000 1000'
  >
    <title>Dodecahedron</title>
    <g fill='currentColor'>
      <path d='m646.95 1098.9-312.35-91.945 52.621-191.77 349.52-31.98 154.18 174.8z' />
      <path d='m113.11 485.1 122.09-2.5938 123.39 301.77 8.7461 21.504-50.891 185.94-156.77-186.27z' />
      <path d='m298.29 245.46 236.93-136.68-24.516 117.66-272.38 234.35-114.74 2.4844z' />
      <path d='m871.46 193.06 157.1 186.7-197.5 26.902-298.43-179.66 26.258-125.99z' />
      <path d='m732.52 761.91-346.82 31.766-7.0195-17.387-0.10938-0.10938-123.28-301.56 266.33-229.16 294.74 177.62z' />
      <path d='m907.34 943.97-154.29-174.92 84.48-341.41 202.8-27.672 46.57 320.26z' />
    </g>
  </svg>
)

export default function CheckboxDemo() {
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
              <BreadcrumbPage>Checkbox</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ThemeToggle />
      </header>
      <div className='flex-1 overflow-y-auto p-6'>
        <div className='max-w-md mx-auto space-y-3'>
          <div className='flex items-center gap-3'>
            <Checkbox checked={false} />
            <span>Unchecked</span>
          </div>
          <div className='flex items-center gap-3'>
            <Checkbox checked={true} />
            <span>Checked</span>
          </div>
          <div className='flex items-center gap-3'>
            <Checkbox checked={false} indeterminate={true} />
            <span>Indeterminate</span>
          </div>
        </div>
      </div>
    </div>
  )
}
