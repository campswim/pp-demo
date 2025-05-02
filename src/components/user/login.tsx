'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/utils/userActions'
import { useLoggedIn } from '@/context/loggedIn'

const Login = ({ demo = false }: { demo?: boolean }) => {
  const [state, action, pending] = useActionState(login, undefined)
  const { role } = useLoggedIn()
  const router = useRouter()
  const inputStyle = 'w-full rounded-md border border-input focus:border-transparent focus:outline-none bg-background py-2 px-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset'

  console.log({demo})
  
  useEffect(() => {
    if (!demo && role && role !== 'guest') router.push('/?login=true')
  })

  return (
    <form 
      action={action}
      className='flex flex-col items-center w-1/3 mx-auto md:p-8 p-3' 
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
          className={inputStyle}
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
          className={inputStyle}
          autoComplete='on'
          required
        />
      </div>
      <button
        disabled={pending}
        type='submit'
        className='w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
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

export default Login