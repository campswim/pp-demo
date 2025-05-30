import Logo from '@/components/navbar/logo'
import Image from 'next/image'

const HomeMobileContent = () => {
  return(
    <div className='bg-white text-black dark:bg-gray-900 dark:text-white font-sans antialiased'>
      <div className='text-center p-8'>
        <h2 className='mt-2 text-xl font-bold'>Multi-Factor Authentication</h2>
        <p className='my-2'>Welcome to the revolutionary cloud-based solution to the</p>
        <hr className='border-t-2 border-gray-900 dark:border-white' />
        <p className='py-4'><strong>authentication nightmare</strong></p>
        <hr className='border-t-2 border-gray-900 dark:border-white' />
        <p className='mt-2'> for every enterprise and person around the world.</p>
      </div>

      <section className='text-center py-8 bg-gray-100 dark:bg-gray-800'>
        <p className='text-5xl font-semibold'>Unparalleled</p>
        <ul className='italic my-2'>
          <li className='text-3xl leading-loose'>Security</li>
          <li className='text-3xl leading-loose'>Simplicity</li>
          <li className='text-3xl leading-loose'>Speed</li>
        </ul>
        <p className='text-5xl'>+</p>
        <p className='text-3xl leading-loose italic'>Low Cost</p>
        <p className='text-5xl'>=</p>
        <Logo hrefBoolean={false} caller='public homepage'/>
      </section>

      <section className='py-8 text-center'>
        <h2 className='text-2xl font-semibold'>If you have a</h2>
        <div className='relative w-full h-[30rem] sm:h-[40rem] md:h-[50rem]'>
          <Image 
            src='/images/brain.png' 
            alt='Brain' 
            fill 
            className='object-contain py-4'
          />
        </div>
        <p className='text-2xl font-semibold'>and a</p>
        <div className='relative w-full h-[30rem] sm:h-[40rem] md:h-[50rem]'>
          <Image 
            src='/images/landline.png' 
            alt='Landline' 
            fill 
            className='object-contain py-4'
          />
        </div>
        <p>or</p>
        <div className='relative w-full h-[30rem] sm:h-[40rem] md:h-[50rem]'>
          <Image 
            src='/images/smartphone.png' 
            alt='Smartphone' 
            fill 
            className='object-contain py-4'
          />
        </div>
        <p>or</p>
        <div className='relative w-full h-[30rem] sm:h-[40rem] md:h-[50rem]'>
          <Image 
            src='/images/cellphone.png' 
            alt='Cellphone' 
            fill 
            className='object-contain py-4'
          />
        </div>
      </section>

      <section className='bg-red-50 dark:bg-gray-800 py-8'>
        <h3 className='text-xl text-center font-bold mb-6 px-4'>Then you may <i>never</i> need to use</h3>
        <div className='max-w-[90%] mt-4 text-left mx-auto'>
          <div className='flex flex-col items-align text-center mt-4 space-x-4'>
            <figure className='flex flex-col items-center justify-between text-center mb-6 min-h-[15rem] border-1 border-gray-900 dark:border-white rounded-sm'>
                <Image 
                  src='/icons/cell-icon-sms.png' 
                  alt='Cellphone icon with SMS' 
                  width={150}
                  height={150} 
                  className='object-contain py-4'
                />
              <figcaption className='w-full mt-2 text-xl text-gray-100 dark:text-gray-400 bg-gray-900 dark:bg-gray-100 p-2'>
                Access Codes
              </figcaption>
            </figure>
            <figure className='flex flex-col items-center justify-between text-center mb-6 min-h-[15rem] border-1 border-gray-900 dark:border-white rounded-sm'>
                <Image 
                  src='/images/one-time-code.png' 
                  alt='One Time Code' 
                  width={300}
                  height={300} 
                  className='object-contain py-4'
                />
              <figcaption className='w-full mt-2 text-xl text-gray-100 dark:text-gray-400 bg-gray-900 dark:bg-gray-100 p-2'>
                Security Tokens
              </figcaption>
            </figure>
            <div className='flex flex-col items-center justify-between text-center mb-6 min-h-[15rem] border-1 border-gray-900 dark:border-white rounded-sm'>
              <ul className='mx-auto list-disc list-inside space-y-1 text-md text-left pt-10'>
                <li>Must consist of at least 8 characters.</li>
                <li>Must contain upper- and lowercase letters.</li>
                <li>Must have at least 1 special character.</li>
                <li>Must never have been used before.</li>
              </ul>
              <p className='w-full mt-2 text-xl text-gray-100 dark:text-gray-400 bg-gray-900 dark:bg-gray-100 p-2'>Password Rules</p>
            </div>
          </div>
          <h3 className='text-2xl text-center font-bold my-6'><i>ever</i> again.</h3>
        </div>
      </section>

      <section className='max-w-[90%] mx-auto py-8 text-center'>
        <h3 className='text-xl font-semibold mb-2'>Instead, use this unhackable device</h3>
        <hr className='border-t-2 border-gray-900 dark:border-white mt-4' />
        <div className='text-9xl my-8'>🧠</div>
        <hr className='border-t-2 border-gray-900 dark:border-white mb-4' />
        <p className='text-lg text-left'>
          to create and store <strong>one</strong> four-digit PIN and use that with your phone to access any phone-and-pin secured site, all in a matter of seconds.
        </p>
      </section>

      <section className='bg-gray-100 dark:bg-gray-800 text-center py-8'>
        <h3 className='w-[90%] text-xl font-bold'>
          Now that we&#39;ve cracked it, the solution is clear.
        </h3>
        <h4 className='w-[50%] mx-auto mt-10 text-xl text-gray-100 dark:text-gray-400 bg-gray-900 dark:bg-gray-100 p-2 rounded-full'>Learn More</h4>
      </section>

      {/* <footer className='text-center py-8'>
      </footer> */}
    </div>
  )
}

export default HomeMobileContent