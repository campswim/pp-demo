import LoginForm from '@/components/user/login-form'

export default function DemoLogin() {
  return (
    <div className='fixed inset-0 w-full flex justify-center items-center'>
      <LoginForm caller='demo' />
    </div>
  )
}