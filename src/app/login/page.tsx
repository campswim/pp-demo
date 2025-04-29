'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/utils/userActions'
import { useLoggedIn } from '@/context/loggedIn'

export default function Login() {
  const [state, action, pending] = useActionState(login, undefined)
  const { role } = useLoggedIn()
  const router = useRouter()

  useEffect(() => {
    if (role && role !== 'guest') {
      router.push('/')
    }
  }, [role, router])

  return (
    <form 
      action={action}
      className='flex flex-col items-center w-1/4 mx-auto md:p-8 p-3' 
      autoComplete='on'
    >
      <div className='mb-4 w-full'>
        {/* <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
          Username
        </label> */}
        <input
          type='email'
          id='email'
          name='email'
          placeholder='Email'
          className='w-full border shadow rounded py-2 px-3 placeholder:text-gray-500 text-white'
          autoComplete='on'
          required
        />
      </div>
      <div className='mb-4 w-full'>
        {/* <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
          Password
        </label> */}
        <input
          type='password'
          id='password'
          name='password'
          placeholder='Password'
          className='w-full border shadow rounded py-2 px-3 placeholder:text-gray-500 text-white'
          autoComplete='on'
          required
        />
      </div>
      <button
        disabled={pending}
        type='submit'
        className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
        {pending ? 'Stand By' : 'Log In'}
      </button>
      {state?.errors?.email && <p className='my-3'>{state.errors.email}</p>}
      {state?.errors?.password && (
        <div className='my-3'>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  )
}