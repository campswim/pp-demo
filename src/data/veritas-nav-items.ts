import { NavItem } from '@/lib/types'

export const veritasNavItems: NavItem[] = [
  { id: 1, type: 'demo', auth: false, name: 'Services', href: '#' },
  { id: 2, type: 'demo', auth: false, name: 'Specialties', href: '#' },
  { id: 3, type: 'demo', auth: false, name: 'Patient Resources', href: '#' },
  { id: 4, type: 'demo', auth: false, name: 'Insurance', href: '#' },
  { id: 5, type: 'demo', auth: true,  name: 'My Health', href: '#' },
  { id: 6, type: 'demo', auth: true,  name: 'Appointments', href: '#' },
  { id: 7, type: 'demo', auth: true,  name: 'Profile', href: '#' },
  { id: 8, type: 'demo', auth: false, name: 'Log In', href: '/demo/health-care' },
  { id: 9, type: 'demo', auth: true,  name: 'Log Out', href: '/demo/logout' },
]
