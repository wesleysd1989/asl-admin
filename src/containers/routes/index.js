import {
  Dashboard,
  Profile,
  Users,
  User,
  Commemoratives,
  Commemorative,
  Events,
} from '../../pages';

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/accounts/users', name: 'User', component: Users },
  { path: '/accounts/user/:id', name: 'User detail', component: User },
  {
    path: '/commemorative-date',
    exact: true,
    name: 'Commemoratives',
    component: Commemoratives,
  },
  {
    path: '/commemorative-date/:id',
    name: 'Commemorative detail',
    component: Commemorative,
  },
  { path: '/events', name: 'Events', component: Events },
];

export default routes;
