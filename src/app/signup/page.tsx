'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signup } from '@/utils/userActions'

export default function Login() {
  const [state, action, pending] = useActionState(signup, undefined)
  const router = useRouter()
  let username = state?.newUser?.email?.split('@')[0]
  username = username ? username[0]?.toUpperCase() + username?.slice(1) : ''

  useEffect(() => {
    if (state?.message) {
      const timeout = setTimeout(() => {
        router.push('/')
      }, 4000)
      return () => clearTimeout(timeout)
    }
  })

  return state?.message ? 
  (
    <div className='flex flex-col items-center w-1/4 mx-auto md:p-8 p-3'>
      <h2 className='text-lg font-bold mb-4'>{username ? state.message + ', ' + username : state.message}.</h2>
      {/* <p className='text-gray-500'>{state?.errors?.email}</p>
      <p className='text-gray-500'>{state?.errors?.password}</p> */}
    </div>
  )
  :
  (
    <form 
      action={action}
      className='flex flex-col items-center w-1/4 mx-auto md:p-8 p-3' 
      autoComplete='on'
    >
      <div className='mb-4 w-full'>
        {/* <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
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
        Register
      </button>
      {state?.errors?.email && <p>{state.errors.email}</p>}
      {state?.errors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  )
}