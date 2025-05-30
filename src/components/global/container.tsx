import { cn } from '@/lib/utils'

const Container = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn('flex flex-1 flex-col justify-center mx-auto w-[90%] md:max-w-6xl xl:max-w-7xl md:px-8', className)}>
      {children}
    </div>
  )
}

export default Container