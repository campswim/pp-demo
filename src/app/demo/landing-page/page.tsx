import { Button } from '@/components/ui/button'

export default function DemoLandingPage() {
  return (
    <div className='min-h-screen flex flex-col justify-center'>
      <div className='flex flex-col items-center justify-between w-[80%] mx-auto'>
        <h2 className='text-7xl text-center font-heading my-8'>
          Modern banking, tailored to you.
        </h2>
        <h6 className='text-3xl text-center leading-relaxed w-[70%] mx-auto my-10'>
          Experience the future of banking with our innovative financial solutions and exceptional personal service.
        </h6>
        <Button size='lg' className='my-10 text-2xl px-12 py-7 h-auto'>
          Open Account
        </Button>
      </div>
    </div>
  )
}