'use client';

import { GridLoader } from "react-spinners"
import { useState, useEffect } from 'react';

export default function Loading(): React.ReactNode {
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayed(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!delayed) return null;

  return <GridLoader color='orange' />
}