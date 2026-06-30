'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export type DemoSplitPhase = 'idle' | 'splitting' | 'split' | 'melding'

type DemoSplitContextType = {
  phase: DemoSplitPhase
  toggle: () => void
}

const DemoSplitContext = createContext<DemoSplitContextType | undefined>(undefined)

export function DemoSplitProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<DemoSplitPhase>('idle')

  // Drive the transient phases through to their resting state.
  useEffect(() => {
    if (phase === 'splitting') {
      const t = setTimeout(() => setPhase('split'), 30)
      return () => clearTimeout(t)
    }
    if (phase === 'melding') {
      // Wait for the slide-back transition to finish before swapping back to the single circle.
      const t = setTimeout(() => setPhase('idle'), 650)
      return () => clearTimeout(t)
    }
    return undefined
  }, [phase])

  const toggle = () => {
    setPhase(prev => {
      if (prev === 'idle') return 'splitting'
      if (prev === 'split') return 'melding'
      return prev // ignore clicks mid-transition
    })
  }

  return (
    <DemoSplitContext.Provider value={{ phase, toggle }}>
      {children}
    </DemoSplitContext.Provider>
  )
}

export const useDemoSplit = () => {
  const context = useContext(DemoSplitContext)

  if (context === undefined) throw new Error('useDemoSplit must be used within a DemoSplitProvider')
  else return context
}
