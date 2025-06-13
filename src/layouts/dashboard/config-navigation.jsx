import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Home',
    path: '/',
    icon: icon('ic_analytics'),
    access: ['all'],
  },
  {
    title: 'Main Reservation',
    path: '/reservation',
    icon: icon('ic_user'),
    access: ['insert', 'amend'],
  },
  {
    title: 'Daily Planning',
    path: '/daily-planning',
    icon: icon('ic_cart'),
    access: ['insert', 'amend'],
  },
  // {
  //   title: 'Driver Planning',
  //   path: '/driver-planning',
  //   icon: <img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />,
  // },
  {
    title: 'Users',
    path: '/users',
    icon: icon('ic_user'),
    access: ['admin'],
  },
  {
    title: 'Hotels',
    path: '/hotels',
    icon: icon('ic_blog'),
    access: ['addHotel'],
  },

  {
    title: 'Agencies',
    path: '/agencies',
    icon: icon('ic_disabled'),
    access: ['addAgency'],
  },
  {
    title: 'Services',
    path: '/services',
    icon: icon('ic_service'),
    access: ['admin'],
  },
  {
    title: 'Excursions',
    path: '/excursion',
    icon: icon('ic_guid'),
    access: ['addExcursion'],
  },

  {
    title: 'Vehicles',
    path: '/vehicle',
    icon: icon('ic_vehicle'),
    access: ['addVehicle'],
  },
  {
    title: 'Drivers',
    path: '/drivers',
    icon: <img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />,
    access: ['addDriver'],
  },
  {
    title: 'Guides',
    path: '/guid',
    icon: icon('ic_guid'),
    access: ['addGuide'],
  },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
