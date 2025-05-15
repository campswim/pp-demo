export interface NavItem {
  id: number
  type: 'public' | 'user' | 'admin'
  name: string
  url: string
  subItems?: NavItem[]
}

export const navItems: NavItem[] = [
  { id: 1, type: 'public', name: 'Register', url: '/user/signup' },
  { id: 2, type: 'public', name: 'Log In', url: '/user/login' },
  { id: 3, type: 'user', name: 'Demo', url: '/demo/login' },
  { id: 4, type: 'user', name: 'Profile', url: '/user/profile' },
  { id: 5, type: 'user', name: 'Log Out', url: '/logout' },
  { id: 6, type: 'admin', name: 'Settings', url: '/admin/settings' },
  { id: 7, type: 'admin', name: 'Users', url: '/admin/users' },
]