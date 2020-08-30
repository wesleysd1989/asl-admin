export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
    },
    {
      name: 'Accounts',
      url: '/accounts',
      icon: 'icon-people',
      children: [
        {
          name: 'Users',
          url: '/accounts/users',
          icon: 'icon-user',
        },
      ],
    },
    {
      name: 'Comemorative Date',
      url: '/commemorative-date',
      icon: 'icon-calendar',
    },
    {
      name: 'Event',
      url: '/events',
      icon: 'icon-envelope-letter',
    },
  ],
};
