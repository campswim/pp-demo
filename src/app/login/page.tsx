import { login } from '@/utils/userActions'

export default function Login() {
  return (
    <form 
      action={login}
      className='flex flex-col items-center w-1/4 mx-auto md:p-8 p-3' 
      autoComplete='on'
    >
      <div className='mb-4 w-full'>
        {/* <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
          Username
        </label> */}
        <input
          type='email'
          id='email'
          name='email'
          placeholder='Email'
          className='w-full border shadow rounded py-2 px-3 placeholder:text-gray-500 text-white'
          autoComplete='on'
          required
        />
      </div>
      <div className='mb-4 w-full'>
        {/* <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
          Password
        </label> */}
        <input
          type='password'
          id='password'
          name='password'
          placeholder='Password'
          className='w-full border shadow rounded py-2 px-3 placeholder:text-gray-500 text-white'
          autoComplete='on'
          required
        />
      </div>
      <button
        type='submit'
        className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
        Log In
      </button>
    </form>
  )
}