'use client'

import { usePathname } from 'next/navigation'

export default function DemoBackground() {
  const pathname = usePathname()

  if (!pathname.startsWith('/demo')) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-0">
      <p className="watermark">
        {'DEMO'.split('').map((letter, idx) => (
          <span key={idx}>{letter}</span>
        ))}
      </p>    
    </div>
  )
}