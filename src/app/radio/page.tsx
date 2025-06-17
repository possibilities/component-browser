'use client'

import { useState } from 'react'
import { Radio } from '@/registry/default/radio/radio'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ArtHackIcon } from '@/components/icons/arthack-icon'

export default function RadioDemo() {
  const [selectedOption, setSelectedOption] = useState('option1')

  const radioOptions = [
    { id: 'option1', label: 'First option' },
    { id: 'option2', label: 'Second option' },
    { id: 'option3', label: 'Third option' },
  ]

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
              <BreadcrumbPage>Radio</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ThemeToggle />
      </header>
      <div className='flex-1 overflow-y-auto p-6'>
        <div className='max-w-md mx-auto space-y-6'>
          <div className='space-y-3'>
            <h3 className='text-sm font-medium text-muted-foreground mb-2'>
              States
            </h3>
            <div className='flex items-center gap-3'>
              <Radio checked={false} />
              <span>Unchecked</span>
            </div>
            <div className='flex items-center gap-3'>
              <Radio checked={true} />
              <span>Checked</span>
            </div>
          </div>

          <div className='space-y-3'>
            <h3 className='text-sm font-medium text-muted-foreground mb-2'>
              Radio Group Example
            </h3>
            {radioOptions.map(option => (
              <div key={option.id} className='flex items-center gap-3'>
                <Radio
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                />
                <span
                  className='cursor-pointer select-none'
                  onClick={() => setSelectedOption(option.id)}
                >
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
