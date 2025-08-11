import './App.css';
import { UserButton, useUser } from '@clerk/clerk-react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useState } from 'react';
import MenuSideBar from './components/MenuSideBar/MenuSideBar';
import AppRoutes from './routes/AppRoutes';
import PublicRoutes from './routes/PublicRoutes';
import ChatLauncher from './components/ChatLauncher/ChatLauncher';
import PWAInstall from './components/PWAInstall/PWAInstall';

function App() {
  const { user, isSignedIn } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const userRole = String(user?.publicMetadata?.role);

  const MobileMenuOverlay = () => (
    <div className='mobile-menu-overlay'>
      <div className='mobile-menu-backdrop' onClick={closeMobileMenu} />
      <div className='mobile-menu-sidebar'>
        <MenuSideBar userRole={userRole} onLinkClick={closeMobileMenu} />
      </div>
    </div>
  );

  const MobileMenuButton = () => (
    <button
      className='mobile-menu-button'
      onClick={toggleMobileMenu}
      aria-label='Toggle menu'
    >
      <svg
        className='menu-icon'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M4 6h16M4 12h16M4 18h16'
        />
      </svg>
    </button>
  );

  const Header = () => (
    <header className='welcome-header'>
      <div className='header-content'>
        <div className='header-left'>
          <MobileMenuButton />
          <h1 className='app-title'>SurgeVenger</h1>
        </div>

        <div className='header-right'>
          {user && (
            <p className='welcome-text'>
              Welcome, {user.username} ({userRole})
            </p>
          )}
          <UserButton />
        </div>
      </div>
    </header>
  );

  const Dashboard = () => (
    <div className='dashboard-container'>
      <div className='desktop-sidebar'>
        <MenuSideBar userRole={userRole} />
      </div>

      {isMobileMenuOpen && <MobileMenuOverlay />}

      <div className='main-content'>
        <Header />
        <main className='main-content-inner'>
          <AppRoutes userRole={userRole} />
        </main>
      </div>
    </div>
  );

  return (
    <div className='App'>
      <Router>
        {isSignedIn ? <Dashboard /> : <PublicRoutes />}
        <ChatLauncher />
        <PWAInstall />
      </Router>
    </div>
  );
}

export default App;
