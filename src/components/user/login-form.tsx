'use client'

import { useActionState } from 'react'
import { signup, login } from '@/utils/userActions'
import { demoLogin } from '@/utils/demoActions'

const Login = ({ caller }: { caller: string }) => {
  const [state, action, pending] = useActionState(caller === 'register' ? signup : caller === 'demo' ? demoLogin : login, undefined)
  const inputStyle = 'peer w-full rounded-md border border-input focus:border-transparent focus:outline-none bg-background pt-5 pb-1 px-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset'
  
  return (
    <form 
      action={action}
      className='flex flex-col items-center mx-auto min-w-[20rem] z-10 md:p-8 p-3 border-2 border-border dark:border-none bg-white/70 dark:bg-black/50 rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.3)]'
      autoComplete='on'
    >
      <div className='relative mb-4 w-full'>
        <input
          type='username'
          id='username'
          name='username'
          placeholder=' '
          className={inputStyle}
          autoComplete='on'
          required
        />
        <label 
          htmlFor='username' 
          className='absolute left-3 top-1 text-[.65rem] text-muted-foreground transition-all duration-200 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[.65rem]'
        >
          Username
        </label>
      </div>
      <div className='relative mb-4 w-full'>
        <input
          type='password'
          id='password'
          name='password'
          placeholder=' '
          className={inputStyle}
          autoComplete='on'
          required
        />
        <label 
          htmlFor='password' 
          className='absolute left-3 top-1 text-[.65rem] text-muted-foreground transition-all duration-200 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[.65rem]'
        >
          Password
        </label>
      </div>
      {caller === 'register' && (
        <>
          <div className='relative mb-4 w-full'>
            <input
              type='tel'
              id='phone'
              name='phone'
              placeholder=' '
              className={inputStyle}
              autoComplete='on'
              required
            />
            <label 
              htmlFor='phone' 
              className='absolute left-3 top-1 text-[.65rem] text-muted-foreground transition-all duration-200 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[.65rem]'
            >
              Phone
            </label>
          </div>
          <div className='relative mb-4 w-full'>
            <input
              type='text'
              id='safeword'
              name='safeword'
              placeholder=' '
              className={inputStyle}
              autoComplete='off'
              required
            />
            <label 
              htmlFor='safeword' 
              className='absolute left-3 top-1 text-[.65rem] text-muted-foreground transition-all duration-200 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[.65rem]'
            >
              Safe Word
            </label>
          </div>
          <div className='relative mb-4 w-full'>
            <input
              type='number'
              id='pin'
              name='pin'
              placeholder=' '
              className={inputStyle}
              autoComplete='off'
              required
            />
            <label 
              htmlFor='pin' 
              className='absolute left-3 top-1 text-[.65rem] text-muted-foreground transition-all duration-200 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[.65rem]'
            >
              Four-digit PIN
            </label>
          </div>
        </>
      )}
      <button
        disabled={pending}
        type='submit'
        className="w-full rounded-md bg-primary dark:bg-primary/80 px-3 pb-1 pt-5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 dark:hover:bg-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
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
            return <p key={key}>{key}: {value}</p>
          })
        )
      )}
    </form>
  )
}

export default Login