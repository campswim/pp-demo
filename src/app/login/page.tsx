export default function Login() {
  return (
    <div className='flex flex-col items-center justify-center rounded bg-gray-100'>
      <form className='flex flex-col justify-center w-96 shadow-md p-8'>
        <div className='mb-4'>
          {/* <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
            Username
          </label> */}
          <input
            type='text'
            id='username'
            placeholder='Username'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <div className='mb-6'>
          {/* <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
            Password
          </label> */}
          <input
            type='password'
            id='password'
            placeholder='Password'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <button
          type='submit'
          className='
            cursor-pointer 
            bg-blue-500 
            hover:bg-blue-700 
            text-white 
            font-bold 
            py-2 
            px-4 
            rounded 
            w-[50%]
            mx-auto 
            transition-colors 
            duration-700 
            focus:outline-none 
            focus:shadow-outline
          '>
          Log In
        </button>
      </form>
    </div>
  );
}