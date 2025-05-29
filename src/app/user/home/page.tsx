import WelcomeMessage from '@/components/user/welcomeMessage'
import LogoBackground from '@/components/ui/logo-background'

export default function Home() {
  return (
    <>
      <div className='relative w-full'>
        <LogoBackground />
        <WelcomeMessage />
      <div className='flex flex-col items-center justify-center'>
        <div className='flex flex-col items-center justify-center w-full mb-5 lg:mb-15 p-4 border-b bg-blue-100 dark:bg-gray-900 text-center text-2xl lg:text-6xl lg:min-h-48'>
          <h1>
            How to Use the Phone-and-Pin Demo
          </h1>
        </div>
        <ol className='list-decimal pl-10 pr-4 lg:text-2xl lg:max-w-[40%]'>
          <li>Select &quot;Demo&quot; from the footer.</li>
          <li>Have your safe word and PIN at the ready.</li>
          <li>Log into your demo account using your credentials for this site.</li>
          <li>Accept the incoming phone call triggered by clicking the log-in button.</li>
          <li>Follow the prompts of the call:</li>
          <ul className='list-disc px-4'>
            <li>Speak your safe word.</li>
            <li>Enter your four-digit PIN.</li>
          </ul>
          <li>Wait to be redirected to your account&#39;s page upon successful authentication.</li>
          <li>In the event of an error, wait to be redirected to the demo log-in page and try again.</li>
        </ol>
      </div>
      </div>
    </>
  )
}
