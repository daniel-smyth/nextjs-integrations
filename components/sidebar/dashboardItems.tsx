import { Users, Home } from 'react-feather';
import { SidebarItems } from '../../types/sidebar';

const homeSection = [
  {
    href: '/#',
    icon: Home,
    title: 'Home'
  }
] as SidebarItems[];

const settingsSection = [
  {
    href: '/',
    icon: Users,
    title: 'User',
    children: [
      {
        href: '/',
        title: 'Profile'
      }
    ]
  }
] as SidebarItems[];

const navItems = [
  {
    title: '',
    pages: homeSection
  },
  {
    title: 'Settings',
    pages: settingsSection
  }
];

export default navItems;
