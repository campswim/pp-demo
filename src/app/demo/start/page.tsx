import GridLoaderClient from '@/components/ui/grid-loader'
import { initiateCall } from '@/utils/voice'

const DemoStart = async () => {

  const call = await initiateCall()

  console.log({call})

  return (
    <div>
      <p>Thanks for logging in.</p>
      <p>Stand by for an incoming call to your phone on record.</p>
      <p>Please have your safe word and PIN at the ready.</p>
      <GridLoaderClient />
    </div>
  )
}

export default DemoStart