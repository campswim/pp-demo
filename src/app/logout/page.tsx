'use client'

import { useEffect, useState, startTransition } from 'react'
import { logout } from '@/utils/userActions'

export default function Logout() {
  const [state, setState] = useState<{ message: string } | null>(null)

  useEffect(() => {
    let isMounted = true;

    startTransition(() => {
      logout().then((result) => {
        if (isMounted) setState(result);
      });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <p className='mt-4 text-lg'>
        {state?.message || 'Logging you out...'}
      </p>
    </div>
  );
}