import Login from '@/components/user/login'
import { login } from '@/utils/userActions'

export default function LoginPage() {
  return <Login caller='login' userAction={login} />
}