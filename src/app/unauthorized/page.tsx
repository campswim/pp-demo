/**
 * @file Unauthorized access page.
 * @description Displayed when a user tries to access a restricted route without proper permissions.
 * Shows the detected user role for context.
 * @module /app/unauthorized/page.tsx
 */

interface UnauthorizedPageProps {
  searchParams: Promise<{ role?: string }>
}

export default async function UnauthorizedPage({ searchParams }: UnauthorizedPageProps) {
  const params = await searchParams
  const role = params.role ?? ''

  return (
    <div className='flex min-h-screen flex-col items-center justify-center text-center p-8'>
      <h1 className='text-4xl font-bold mb-4'>Unauthorized</h1>
      <p className='text-lg text-gray-600'>
        Your role{role && role !== 'undefined' && (
          <> of <span className='text-orange-500 font-semibold'>{role}</span></>
        )} does not provide access to this page.
      </p>
    </div>
  )
}