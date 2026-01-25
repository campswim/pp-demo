import LoginForm from '@/components/user/login-form'

export default function Signup() {
  return (
    <div className='md:inset-0 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <LoginForm caller='register' />
      </div>
    </div>
  )
}