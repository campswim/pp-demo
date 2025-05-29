import LoginForm from '@/components/user/login-form'
import LogoBackground from '@/components/ui/logo-background'

export default function Signup() {
  return (
    <div className='relative w-full h-screen flex justify-center items-center'>
      <LogoBackground />
      <LoginForm caller='register' />
    </div>
  )
}