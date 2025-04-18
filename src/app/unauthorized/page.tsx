/**
 * @file Unauthorized access page.
 * @description Displayed when a user tries to access a restricted route without proper permissions.
 * Shows the detected user role for context.
 * @module /app/unauthorized/page.tsx
 */

interface UnauthorizedPageProps {
  searchParams: { role?: string }
}

export default function UnauthorizedPage({ searchParams }: UnauthorizedPageProps) {
  const role = searchParams.role ?? 'unknown'
  const placeholder = role ? `of <span className='font-mono font-semibold'>${role}</span>` : ''
  const message = `Your role ${placeholder} does not provide access to this page.`

  return (
    <div className='flex min-h-screen flex-col items-center justify-center text-center p-8'>
      <h1 className='text-4xl font-bold mb-4'>Unauthorized</h1>
      <p className='text-lg text-gray-600'>
        {message}
      </p>
    </div>
  )
}