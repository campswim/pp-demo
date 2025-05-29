import Logo from '@/components/navbar/logo'

export default function LogoBackground() {
  return (
    <div className='fixed inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0 overflow-hidden'>
      <Logo />
    </div>
  )
}