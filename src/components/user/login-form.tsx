'use client'

import { useActionState, useState } from 'react'
import { signup, login } from '@/utils/userActions'
import { demoLogin } from '@/utils/demoActions'

const Login = ({ caller }: { caller: string }) => {
  const [state, action, pending] = useActionState(caller === 'register' ? signup : caller === 'demo' ? demoLogin : login, undefined)
  const [usernamePlaceholder, setUsernamePlaceholder] = useState<string | null>('Username')
  const [phonePlaceholder, setPhonePlaceholder] = useState<string | null>('Phone Number')
  const [pwdPlaceholder, setPwdPlaceholder] = useState<string | null>('Password')
  // const { role } = useLoggedIn()
  const inputStyle = 'w-full rounded-md border border-input focus:border-transparent focus:outline-none bg-background py-2 px-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset'
  
  return (
    <form 
      action={action}
      className='flex flex-col items-center mx-auto md:p-8 p-3' 
      autoComplete='on'
    >
      <div className='mb-4 w-full'>
        <input
          type='username'
          id='username'
          name='username'
          placeholder={usernamePlaceholder ?? undefined}
          className={inputStyle}
          autoComplete='on'
          onFocus={() => setUsernamePlaceholder('')}
          onBlur={() => setUsernamePlaceholder('Username')}
          required
        />
      </div>
      {caller === 'register' && (
        <div className='mb-4 w-full'>
          <input
            type='phone'
            id='phone'
            name='phone'
            placeholder={phonePlaceholder ?? undefined}
            className={inputStyle}
            autoComplete='on'
            onFocus={() => setPhonePlaceholder('')}
            onBlur={() => setPhonePlaceholder('Phone Number')}
            required
          />
        </div>
      )}
      <div className='mb-4 w-full'>
        <input
          type='password'
          id='password'
          name='password'
          placeholder={pwdPlaceholder ?? undefined}
          className={inputStyle}
          autoComplete='on'
          onFocus={() => setPwdPlaceholder('')}
          onBlur={() => setPwdPlaceholder('Password')}
          required
        />
      </div>
      <button
        disabled={pending}
        type='submit'
        className='w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
        {pending ? 'Stand By' : caller === 'register' ? 'Register' : 'Log In'}
      </button>
      {state?.errors?.username && <p className='my-3'>{state.errors.username}</p>}
      {state?.errors?.password && (
        <div className='my-3'>
          <p>The password must: </p>
          <ul className='list-disc pl-5'>
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