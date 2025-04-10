import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PersonIcon from '@mui/icons-material/Person';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import GroupIcon from '@mui/icons-material/Group';
import { SvgIconTypeMap } from '@mui/material';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import HomeIcon from '@mui/icons-material/Home';


export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  'exercises': FitnessCenterIcon,
  'fitness': SportsGymnasticsIcon,
  'clients': GroupIcon,
  'profile': PersonIcon,
  'home': HomeIcon,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon | OverridableComponent<SvgIconTypeMap> & { muiName: string }>;
