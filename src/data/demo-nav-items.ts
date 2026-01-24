import { NavItem } from '@/lib/types'

export const demoNavItems: NavItem[] = [
  { id: 1, type: 'demo', auth: true, name: 'Accounts', href: '/demo/account' },
  { id: 2, type: 'demo', auth: false, name: 'Personal Banking', href: '#' },
  { id: 3, type: 'demo', auth: false, name: 'Commercial Banking', href: '#' },
  { id: 4, type: 'demo', auth: false, name: 'Loans', href: '#' },
  { id: 5, type: 'demo', auth: true, name: 'Transfer', href: '#' },
  { id: 6, type: 'demo', auth: true, name: 'Rewards', href: '#' },
  { id: 7, type: 'demo', auth: true, name: 'Profile', href: '#'},
  { id: 8, type: 'demo', auth: false, name: 'Log In', href: '/demo/login'},
  { id: 10, type: 'demo', auth: true, name: 'Log Out', href: '/demo/logout' },
  { id: 11, type: 'demo', auth: false, name: 'Register', href: '/demo/register-creds' },
]
