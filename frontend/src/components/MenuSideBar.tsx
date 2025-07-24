import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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
      roles: ['admin'],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className='w-64 bg-primary text-white shadow-lg'>
      <div className='p-6'>
        <h2 className='font-semibold text-2xl text-left pb-4'>
          SurgeVenger Dashboard
        </h2>
        <nav>
          <ul className='space-y-2'>
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-accent text-primary font-semibold'
                      : 'hover:bg-hover hover:text-primary'
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
