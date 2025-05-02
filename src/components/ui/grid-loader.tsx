'use client'

import { useState, useEffect } from 'react'
import { GridLoader } from 'react-spinners'

export default function GridLoaderClient() {
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    // Ensure loader only shows after hydration
    setShowLoader(true)
  }, [])

  if (!showLoader) return null

  return (
    <div className="flex justify-center items-center h-40">
      <GridLoader color="#36d7b7" />
    </div>
  )
}