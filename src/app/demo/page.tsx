import Login from '@/components/user/login'
import { demoLogin } from '@/utils/demoActions'

export default function Demo() {
  return <Login caller='demo' userAction={demoLogin} />
}