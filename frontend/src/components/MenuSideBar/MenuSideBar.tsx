import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MenuSideBar.css';

interface SidebarProps {
  userRole: string;
}

const MenuSideBar: React.FC<SidebarProps> = ({ userRole }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: '/status',
      label: 'Status List',
      roles: ['admin', 'surgery-team'],
    },
    {
      path: '/patients',
      label: 'Patient List',
      roles: ['admin', 'surgery-team'],
    },
    {
      path: '/new-patient',
      label: 'Create Patient',
      roles: ['admin'],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className='sidebar'>
      <div className='p-6'>
        <h2 className='sidebar-header'>SurgeVenger Dashboard</h2>
        <nav>
          <ul className='space-y-2'>
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-link ${
                    isActive(item.path) ? 'sidebar-link--active' : ''
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MenuSideBar;
