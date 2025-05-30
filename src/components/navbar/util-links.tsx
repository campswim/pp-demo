import { ModeToggle } from '@/components/ui/mode-toggle'

export default function UtilLinks() {
  return (
    <div className='absolute right-0 bottom-3 xs:-bottom-1 sm:static sm:flex sm:items-center sm:justify-end sm:gap-4'>
      <ModeToggle />
    </div>
  )
}
