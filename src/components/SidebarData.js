import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faHome, faUser } from '@fortawesome/free-solid-svg-icons';

export const SidebarData = [
  {
    title: '홈',
    path: '/',
    icon: <FontAwesomeIcon icon={faHome} />,
    cName: 'nav-text'
  },
  {
    title: '계정',
    path: '/profile',
    icon: <FontAwesomeIcon icon={faUser} />,
    cName: 'nav-text'
  },
  {
    title: '통계',
    path: '/profile',
    icon: <FontAwesomeIcon icon={faChartBar} />,
    cName: 'nav-text'
  },
];