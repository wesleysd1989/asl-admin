import {
  Dashboard,
  Profile,
  Users,
  User,
  Commemoratives,
  Commemorative,
  Events,
  Event,
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
  { path: '/events', exact: true, name: 'Events', component: Events },
  { path: '/events/:id', name: 'Event', component: Event },
];

export default routes;
