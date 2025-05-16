import { ModeToggle } from '@/components/ui/mode-toggle'

export default function UtilLinks() {
  return (
    <div className='absolute right-0 bottom-0 md:static md:flex md:items-center md:justify-end md:gap-4'>
      <ModeToggle />
    </div>
  )
}
