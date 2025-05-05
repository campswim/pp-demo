'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLoggedIn } from '@/context/loggedIn'
import { getPlaceholders } from '@/utils/helpers'
import { FormState } from '@/lib/schemata'

type LoginProps = {
  caller: string
  userAction: ((state: FormState, formData: FormData) => Promise<FormState>)
}

const Login = ({ caller, userAction }: LoginProps) => {

  console.log({caller, userAction })

  const [state, action, pending] = useActionState(userAction, undefined)
  const [tempNamePlaceholder, setTempNamePlaceholder] = useState<string | null>(null)
  // const [tempEmailPlaceholder, setTempEmailPlaceholder] = useState<string | null>(null)
  const [tempPwdPlaceholder, setTempPwdPlaceholder] = useState<string | null>(null)
  const { role } = useLoggedIn()
  const router = useRouter()
  const { 
    username: namePlaceholder, 
    // email: emailPlaceholder, 
    password: pwdPlaceholder 
  } = getPlaceholders(caller)
  const inputStyle = 'w-full rounded-md border border-input focus:border-transparent focus:outline-none bg-background py-2 px-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset'

  // Redirect logged-in users to the home page.
  useEffect(() => {
    if (caller !== 'demo' && role && role !== 'guest') {
      if (caller === 'register') router.push('/?register=true')
      else if (caller === 'login') router.push('/?login=true')
    }
  })

  if (state?.message && state.message === 'success') router.push('/demo/start')

  console.log({state})
  
  return (
    <form 
      action={action}
      className='flex flex-col items-center w-1/3 mx-auto md:p-8 p-3' 
      autoComplete='on'
    >
      <div className='mb-4 w-full'>
        <input
          type='username'
          id='username'
          name='username'
          placeholder={tempNamePlaceholder ?? namePlaceholder}
          className={inputStyle}
          autoComplete='on'
          onFocus={() => setTempNamePlaceholder('')}
          onBlur={() => setTempNamePlaceholder(null)}
          required
        />
      </div>
      {/* <div className='mb-4 w-full'>
        <input
          type='email'
          id='email'
          name='email'
          placeholder={tempEmailPlaceholder ?? emailPlaceholder}
          className={inputStyle}
          autoComplete='on'
          onFocus={() => setTempEmailPlaceholder('')}
          onBlur={() => setTempEmailPlaceholder(null)}
          required
        />
      </div> */}
      <div className='mb-4 w-full'>
        <input
          type='password'
          id='password'
          name='password'
          placeholder={tempPwdPlaceholder ?? pwdPlaceholder}
          className={inputStyle}
          autoComplete='on'
          onFocus={() => setTempPwdPlaceholder('')}
          onBlur={() => setTempPwdPlaceholder(null)}
          required
        />
      </div>
      <button
        disabled={pending}
        type='submit'
        className='w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
        {pending ? 'Stand By' : caller === 'register' ? 'Register' : 'Log In'}
      </button>
      {state?.errors?.email && <p className='my-3'>{state.errors.email}</p>}
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