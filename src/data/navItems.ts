export interface NavItem {
  id: number;
  type: 'public' | 'private' | 'admin';
  name: string;
  url: string;
  subItems?: NavItem[];
}

export const navItems: NavItem[] = [
  { id: 1, type: 'public', name: 'Register', url: '/register' },
  { id: 2, type: 'public', name: 'Log In', url: '/login' },
  { id: 3, type: 'private', name: 'Log Out', url: '/logout' },
  { id: 4, type: 'private', name: 'Profile', url: '/profile' },
  {
    id: 5,
    type: 'private',
    name: 'Settings',
    url: '/settings',
    subItems: [
      { id: 8, type: 'admin', name: 'Notifications', url: '/admin/notifications' }
    ]
  },
  { 
    id: 6, 
    type: 'admin', 
    name: 'Dashboard', 
    url: '/admin/dashboard',
    subItems: [
      { id: 9, type: 'admin', name: 'Users', url: '/admin/users' },
      { id: 10, type: 'admin', name: 'Reports', url: '/admin/reports' },
      { id: 11, type: 'admin', name: 'Logs', url: '/admin/logs' }
    ]
  },
  {
    id: 7,
    type: 'admin',
    name: 'Settings',
    url: '/admin/settings',
    subItems: [
      { id: 12, type: 'admin', name: 'Notifications', url: '/admin/notifications' }
    ]
  }
];