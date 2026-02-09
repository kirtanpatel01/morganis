'use client'

import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import React from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative'>
        <Link href="/" className=''>
          <Button variant="outline" className='cursor-pointer absolute top-4 left-4'>
            <ArrowLeft /> Back to Home
          </Button>
        </Link>
        <div className="absolute top-4 right-4 cursor-pointer">
          <ModeToggle />
        </div>
      {children}
    </div>
  )
}

export default layout