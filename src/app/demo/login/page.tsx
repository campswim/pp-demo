import LoginForm from '@/components/user/login-form'
import Demo from '@/components/ui/demo-background'

export default function DemoLogin() {
  return (
    <div className='relative w-full flex justify-center'>
      <Demo />
      <LoginForm caller='demo' />
    </div>
  )
}