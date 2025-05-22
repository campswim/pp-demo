'use client'

import { useActionState, useState } from 'react'
import { signup, login } from '@/utils/userActions'
import { demoLogin } from '@/utils/demoActions'

const Login = ({ caller }: { caller: string }) => {
  const [state, action, pending] = useActionState(caller === 'register' ? signup : caller === 'demo' ? demoLogin : login, undefined)
  const [usernamePlaceholder, setUsernamePlaceholder] = useState<string | null>('Username')
  const [phonePlaceholder, setPhonePlaceholder] = useState<string | null>('Phone Number')
  const [safewordPlaceholder, setSafewordPlaceholder] = useState<string | null>('Safeword')
  const [pinPlaceholder, setPinPlaceholder] = useState<string | null>('4-Digit PIN')
  const [pwdPlaceholder, setPwdPlaceholder] = useState<string | null>('Password')
  const inputStyle = 'w-full rounded-md border border-input focus:border-transparent focus:outline-none bg-background pt-5 pb-1 px-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset'
  
  return (
    <form 
      action={action}
      className='flex flex-col items-center mx-auto min-w-[20rem] md:p-8 p-3' 
      autoComplete='on'
    >
      <div className='mb-4 w-full'>
        {/* <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Username
        </label> */}
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
      {caller === 'register' && (
        <>
          <div className='mb-4 w-full'>
            <input
              type='tel'
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
          <div className='mb-4 w-full'>
            <input
              type='text'
              id='safeword'
              name='safeword'
              placeholder={safewordPlaceholder ?? undefined}
              className={inputStyle}
              autoComplete='off'
              onFocus={() => setSafewordPlaceholder('')}
              onBlur={() => setSafewordPlaceholder('Safeword')}
              required
            />
          </div>
          <div className='mb-4 w-full'>
            <input
              type='number'
              id='pin'
              name='pin'
              placeholder={pinPlaceholder ?? undefined}
              className={inputStyle}
              autoComplete='off'
              onFocus={() => setPinPlaceholder('')}
              onBlur={() => setPinPlaceholder('4-Digit PIN')}
              required
            />
          </div>
        </>
      )}
      <button
        disabled={pending}
        type='submit'
        className='w-full rounded-md bg-primary px-3 pb-1 pt-5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
        {pending ? 'Stand By' : caller === 'register' ? 'Register' : 'Log In'}
      </button>
      {state?.errors && 
      (state?.errors?.password ? 
        (
          <div className='my-3'>
            <p>The password must: </p>
            <ul className='list-disc pl-5'>
              {state.errors.password.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )
        :
        (
          Object.entries(state.errors).map(([key, value]) => {
            console.log({key, value})
            return <p key={key}>{key}: {value}</p>
          })
        )
      )}
    </form>
  )
}

export default Login