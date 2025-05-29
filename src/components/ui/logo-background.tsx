import Logo from '@/components/navbar/logo'

export default function LogoBackground() {
  return (
    <div className='absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0'>
      <Logo logoSize={800} />
    </div>
  )
}