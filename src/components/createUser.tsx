'use client'

import { useState, useEffect, useActionState } from 'react'
import { createUser } from '@/utils/actions'

const initialState = { success: false, error: null }

export default function NewUserForm() {
  const [state, formAction] = useActionState(createUser, initialState)
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (state.error) {
      setError(state.error);
      const timeout = setTimeout(() => {
        setError('');
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [state])

  return (
      <form 
        action={formAction}
        className='w-full max-w-[80%] flex flex-col gap-y-4 p-8 pb-16 shadow rounded relative'
      >
        <input 
          type='text' 
          name='email' 
          placeholder='Email' 
          defaultValue='sasha@sasha.sasha' 
          className='border shadow rounded py-2 px-3 placeholder:text-gray-500 text-white' 
        />
        <input 
          type='text'
          name='password' 
          placeholder='Password' 
          defaultValue='nigel' 
          className='border shadow rounded py-2 px-3 placeholder:text-gray-500 text-white' 
        />
        <button 
          type='submit' 
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Go!
          </button>
          {error && 
              <p className='text-orange-400 absolute left-[-20%] right-[-20%] bottom-[-30px] rounded p-8'>{error}</p>
          }
      </form>
  )
}
