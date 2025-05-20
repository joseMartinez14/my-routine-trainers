import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Resumen', href: paths.dashboard.overview, icon: 'home' },
  { key: 'clients', title: 'Clientes', href: paths.dashboard.clients, icon: 'clients' },
  { key: 'routines', title: 'Rutinas', href: paths.dashboard.routines, icon: 'fitness' },
  { key: 'exercises', title: 'Ejercicios', href: paths.dashboard.exercises, icon: 'exercises' },
  { key: 'profile', title: 'Perfil', href: paths.dashboard.profile, icon: 'profile' },
] satisfies NavItemConfig[];
