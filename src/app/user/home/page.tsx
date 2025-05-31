import WelcomeMessage from '@/components/user/welcomeMessage'
import Logo from '@/components/navbar/logo'

export default function Home() {
  return (
    <>
      <div className='relative w-full'>
        <div className='flex flex-col items-center justify-center'>
          <div className='flex flex-col items-center justify-center w-full mb-5 lg:mb-15 p-4 border-b bg-blue-100 dark:bg-gray-900 text-center text-2xl lg:text-6xl lg:min-h-48'>
            <div className='flex flex-col text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-7xl xs:flex-row items-center'>
              <h1>How to Use the</h1>
              <Logo hrefBoolean={false} caller='inline' />
              <h1>Demo</h1>
            </div>
          </div>
          <WelcomeMessage />
          <ol className='list-decimal px-4 space-y-4 xs:px-15 sm:text-xl sm:max-w-[80%] sm:mx-auto lg:text-3xl lg:max-w-[75%] xl:max-w-full'>
            <li>Select &quot;Demo&quot; from the footer.</li>
            <li>Have your safe word and PIN at the ready.</li>
            <li>Log into your demo account using your credentials for this site.</li>
            <li>Accept the incoming phone call triggered by clicking the log-in button.</li>
            <li>Follow the prompts of the call (referring, if needed, to your profile page for your safe word and PIN):
              <ul className='list-disc px-4'>
                <li>Speak your safe word.</li>
                <li>Enter your four-digit PIN.</li>
              </ul>
            </li>
            <li>Wait to be redirected to your account&#39;s page upon successful authentication.</li>
            <li>In the event of an error, wait to be redirected to the demo log-in page and try again.</li>
          </ol>
        </div>
      </div>
    </>
  )
}
