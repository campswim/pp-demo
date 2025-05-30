import LoginForm from '@/components/user/login-form'

export default function DemoLogin() {
  return (
    <div className='w-full flex justify-center'>
      <LoginForm caller='demo' />
    </div>
  )
}