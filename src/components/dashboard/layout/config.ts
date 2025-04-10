import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'home' },
  { key: 'clients', title: 'clients', href: paths.dashboard.clients, icon: 'clients' },
  { key: 'routines', title: 'Routines', href: paths.dashboard.routines, icon: 'fitness' },
  { key: 'exercises', title: 'Exercises', href: paths.dashboard.exercises, icon: 'exercises' },
  { key: 'profile', title: 'Profile', href: paths.dashboard.profile, icon: 'profile' },
] satisfies NavItemConfig[];
