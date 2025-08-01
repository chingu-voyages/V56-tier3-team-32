import './App.css';
import { UserButton, useUser } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuSideBar from './components/MenuSideBar/MenuSideBar';
import AppRoutes from './routes/AppRoutes';
import LogIn from './components/LogIn/LogIn';

function App() {
  const { user, isSignedIn } = useUser();

  const signedInState = () => {
    const userRole = String(user?.publicMetadata?.role);
    return (
      <div className='dashboard-container'>
        <MenuSideBar userRole={userRole} />
        <div className='flex-1'>
          <header className='welcome-header'>
            <div className='header-content'>
              {user && (
                <p className='text-font-secondary'>
                  Welcome, {user.username} ({userRole})
                </p>
              )}
              <UserButton />
            </div>
          </header>
          <main className='p-6'>
            <AppRoutes userRole={userRole} />
          </main>
        </div>
      </div>
    );
  };

  return (
    <div className='App'>
      <Router>
        {!isSignedIn ? (
          <Routes>
            <Route path='/login' element={<LogIn />} />
            <Route path='*' element={<LogIn />} />
          </Routes>
        ) : (
          signedInState()
        )}
      </Router>
    </div>
  );
}

export default App;
