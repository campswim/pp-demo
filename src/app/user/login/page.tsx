import LoginForm from '@/components/user/login-form'
import Logo from '@/components/navbar/logo'

export default function LoginPage() {
  return (
    <div className='relative w-full h-screen flex items-center'>
      <div className='absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0'>
        <Logo logoSize={800} />
      </div>
      <LoginForm caller='login' />
    </div>
  )
}