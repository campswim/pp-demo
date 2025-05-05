import Login from '@/components/user/login'
import { signup } from '@/utils/userActions'

export default function Signup() {
  return <Login caller='register' userAction={signup} />
}