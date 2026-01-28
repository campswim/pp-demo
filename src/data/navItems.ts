import { NavItem } from '@/lib/types'

export const navItems: NavItem[] = [
  { id: 1, type: 'public', name: 'Register', href: '/user/signup' },
  { id: 2, type: 'public', name: 'Log In', href: '/user/login' },
  { id: 3, type: 'user', name: 'Demo', href: '/demo/landing-page' },
  { id: 4, type: 'user', name: 'Profile', href: '/user/profile' },
  { id: 5, type: 'user', name: 'Log Out', href: '/user/logout' },
  { id: 6, type: 'admin', name: 'Settings', href: '/admin/settings' },
  { id: 7, type: 'admin', name: 'Users', href: '/admin/users' },
]