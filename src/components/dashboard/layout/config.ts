import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'clients', title: 'clients', href: paths.dashboard.clients, icon: 'users' },
  { key: 'routines', title: 'Routines', href: paths.dashboard.routines, icon: 'fitness' },
  { key: 'exercises', title: 'Exercises', href: paths.dashboard.exercises, icon: 'exercises' },
  { key: 'profile', title: 'Profile', href: paths.dashboard.profile, icon: 'user' },
] satisfies NavItemConfig[];
