import LoginForm from '@/components/user/login-form'

export default function LoginPage() {
  return (
    <div className='relative w-full flex justify-center items-center'>
      <LoginForm caller='login' />
    </div>
  )
}