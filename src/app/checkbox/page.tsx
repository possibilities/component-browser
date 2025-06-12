'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { ThemeToggle } from '@/components/theme-toggle'

export default function CheckboxDemo() {
  const [items, setItems] = useState([
    { id: 1, label: 'Item 1', checked: false },
    { id: 2, label: 'Item 2', checked: true },
    { id: 3, label: 'Item 3', checked: false },
  ])

  const checkedCount = items.filter(item => item.checked).length
  const allChecked = checkedCount === items.length
  const indeterminate = checkedCount > 0 && checkedCount < items.length

  const toggleAll = () => {
    const newCheckedState = !allChecked
    setItems(items.map(item => ({ ...item, checked: newCheckedState })))
  }

  const toggleItem = (id: number) => {
    setItems(
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    )
  }

  return (
    <div className='h-screen w-full flex flex-col'>
      <header className='flex items-center justify-between px-6 py-4 border-b'>
        <h1 className='text-2xl font-semibold'>Checkbox</h1>
        <ThemeToggle />
      </header>
      <div className='flex-1 overflow-y-auto p-6'>
        <div className='max-w-md mx-auto space-y-8'>
          <section className='space-y-4'>
            <h2 className='text-lg font-medium'>Basic States</h2>
            <div className='space-y-3'>
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
          </section>

          <section className='space-y-4'>
            <h2 className='text-lg font-medium'>Interactive Example</h2>
            <div className='space-y-3 border rounded-lg p-4'>
              <div className='flex items-center gap-3 pb-3 border-b'>
                <Checkbox
                  checked={allChecked}
                  indeterminate={indeterminate}
                  onChange={toggleAll}
                />
                <span className='font-medium'>Select All</span>
              </div>
              {items.map(item => (
                <div key={item.id} className='flex items-center gap-3 ml-6'>
                  <Checkbox
                    checked={item.checked}
                    onChange={() => toggleItem(item.id)}
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <p className='text-sm text-muted-foreground'>
              {checkedCount} of {items.length} selected
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
