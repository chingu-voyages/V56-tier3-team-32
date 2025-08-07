import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MenuSideBar.css';

interface SidebarProps {
  userRole: string;
  onLinkClick?: () => void;
}

const MenuSideBar: React.FC<SidebarProps> = ({ userRole, onLinkClick }) => {
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
    {
      path: '/guest-view',
      label: 'Guest View',
      roles: [],
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => item.roles.length === 0 || item.roles.includes(userRole)
  );

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

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
                  onClick={handleLinkClick}
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
