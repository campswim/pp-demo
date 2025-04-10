'use client'

import { useState, useEffect, useActionState } from 'react'
import { createUser } from '@/utils/userActions'
import { GridLoader } from "react-spinners"

interface CreateUserFormState {
  success?: boolean;
  error?: string | null;
}

const initialState = { success: false, error: null }

export default function NewUserForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('');
  const actionWrapper = async (prevState: CreateUserFormState, formData: FormData) => {
    const result = await createUser(prevState, formData)
    setLoading(false)
    return result
  }
  const [state, formAction] = useActionState(actionWrapper, initialState)

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
      onSubmit={() => setLoading(true)}
      className='w-full lg:w-[30%] md:p-8 border p-3 md:border-gray-30 rounded relative'
      autoComplete='off'
    >
      <fieldset className='flex flex-col gap-y-4'>
        <legend className='text-#ededed text-lg mb-4'>Add a User</legend>
        <input 
          type='text' 
          name='email' 
          placeholder='Email' 
          defaultValue='sasha@sasha.sasha' 
          className='border shadow rounded py-2 px-3 placeholder:text-gray-500 text-white' 
          autoComplete='off'
        />
        <input 
          type='text'
          name='password' 
          placeholder='Password' 
          defaultValue='nigel' 
          className='border shadow rounded py-2 px-3 placeholder:text-gray-500 text-white'
          autoComplete='off'
        />
        {loading ? (
          <div className='flex justify-center'>
            <GridLoader color='#36d7b7' size={10}/>
          </div>
        )
        :
        (
          <button 
            type='submit' 
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
              Go!
          </button>
        )}
        {error && 
          <p className='text-orange-400 absolute left-[-20%] right-[-20%] bottom-[-30px] rounded p-8'>
            {error}
          </p>
        }
      </fieldset>
    </form>
  )
}
