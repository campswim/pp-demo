import Link from 'next/link'

const Logo = () => {
  return (
    <h1 className='text-3xl font-bold'>
      <Link href='/' className='hover:text-blue-500'>
        Phone & Pin
      </Link>
    </h1>
  )
}

export default Logo