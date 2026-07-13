'use client'

import { useActionState } from 'react'
import Image from 'next/image'
import { demoLogin } from '@/utils/demoActions'
import { GridLoader } from 'react-spinners'
import { UserRound, Lock } from 'lucide-react'
import VeritasHeader from '@/components/demo/veritas-header'

export default function HealthCareLogin() {
  const [state, action, pending] = useActionState(demoLogin.bind(null, 'health-care'), undefined)

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto flex flex-col bg-repeat bg-center"
      style={{ backgroundImage: 'url(/backgrounds/veritas-login-background.png)' }}
    >
      <VeritasHeader />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logos/veritas-logo.svg"
            alt="Veritas Private Health"
            width={240}
            height={120}
            priority
            unoptimized
          />
        </div>

        {/* Login card */}
        <form
          action={action}
          className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: '#f2ebda',
            boxShadow: '0 25px 70px rgba(0,0,0,0.45)',
          }}
          autoComplete="on"
        >
          <div className="px-10 py-9">
            <h1
              className="text-2xl font-semibold text-center mb-1.5"
              style={{
                color: '#1e2340',
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              Welcome to Veritas
            </h1>
            <p className="text-center text-sm mb-7" style={{ color: '#7a7a8a' }}>
              Login to your account
            </p>

            {/* Email field */}
            <div
              className="flex items-center gap-3 mb-4 px-4 py-3.5 rounded-xl border"
              style={{ borderColor: '#d5cbad', backgroundColor: '#f9f5ea' }}
            >
              <UserRound size={15} style={{ color: '#b8943a', flexShrink: 0 }} />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-[#aaaabc]"
                style={{ color: '#1e2340' }}
                autoComplete="username"
              />
            </div>

            {/* Password field */}
            <div
              className="flex items-center gap-3 mb-7 px-4 py-3.5 rounded-xl border"
              style={{ borderColor: '#d5cbad', backgroundColor: '#f9f5ea' }}
            >
              <Lock size={15} style={{ color: '#b8943a', flexShrink: 0 }} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-[#aaaabc]"
                style={{ color: '#1e2340' }}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="text-xs whitespace-nowrap hover:underline"
                style={{ color: '#b8943a' }}
              >
                Forgot password?
              </button>
            </div>

            {/* Log In button */}
            <button
              type="submit"
              disabled={pending}
              className="w-full py-3.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-70"
              style={{ backgroundColor: '#b8943a' }}
            >
              {pending ? (
                <span className="flex justify-center">
                  <GridLoader color="#fff" size={3} />
                </span>
              ) : (
                'Log In'
              )}
            </button>

            {/* Error messages */}
            {state?.errors && (
              <div className="mt-3 text-sm text-red-600 text-center">
                {Object.values(state.errors)
                  .flat()
                  .map((err, i) => (
                    <p key={i}>{err as string}</p>
                  ))}
              </div>
            )}

            {/* Secure access by FORTRESS */}
            <div
              className="mt-7 pt-5 flex items-center justify-center gap-2 text-xs"
              style={{ borderTop: '1px solid #d5cbad', color: '#9a9aaa' }}
            >
              <span>Secure access by</span>
              <Image
                src="/logos/Fortress-dark-text.png"
                alt="Fortress"
                width={74}
                height={18}
                style={{ opacity: 0.65 }}
              />
            </div>
          </div>
        </form>
      </div>

    </div>
  )
}
