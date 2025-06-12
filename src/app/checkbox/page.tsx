'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default function CheckboxDemo() {
  return (
    <div className='h-screen w-full flex flex-col'>
      <header className='flex items-center justify-between px-6 py-4 border-b'>
        <Breadcrumb>
          <BreadcrumbList className='text-xl'>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Library</BreadcrumbLink>
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
