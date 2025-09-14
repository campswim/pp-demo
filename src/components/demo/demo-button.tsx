import { useRouter } from 'next/navigation'

const DemoButton = () => {
  const router = useRouter()

  return (
    <div className='fixed inset-0 flex items-center justify-center'>
      <button
        onClick={() => router.push('/demo/login')}
        className='bg-blue-100 dark:bg-orange-400 text-white text-2xl lg:text-5xl rounded-full shadow-xl w-60 h-60 flex items-center justify-center filter brightness-70 animate-fade-in transition-transform duration-500 hover:scale-105 drop-shadow-lg z-10'
      >
        <span className='text-7xl transition-transform duration-800 hover:scale-120'>Demo</span>
      </button>
    </div>
  )
}

export default DemoButton