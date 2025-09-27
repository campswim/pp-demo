import { useRouter } from 'next/navigation'

const DemoButton = () => {
  const router = useRouter()

  return (
    <div className='fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center md:top-1/2'>
      <button
        type='button'
        onClick={() => router.push('/demo/login')}
        className='bg-[#081025] dark:bg-orange-400 text-white text-2xl lg:text-5xl rounded-full shadow-xl w-60 h-60 flex items-center justify-center filter dark:brightness-70 animate-fade-in transition-transform duration-500 hover:scale-105 drop-shadow-lg z-10'
      >
        <span className='dark:text-white text-7xl transition-transform duration-800 hover:scale-120'>Demo</span>
      </button>
    </div>
  )
}

export default DemoButton