import './App.css';
import { UserButton, useUser, useClerk } from '@clerk/clerk-react';
import { BrowserRouter as Router } from 'react-router-dom';
import MenuSideBar from './components/MenuSideBar/MenuSideBar';
import AppRoutes from './routes/AppRoutes';

function App() {
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const signedOutState = () => (
    <button className='sign-in-button' onClick={() => openSignIn()}>
      Sign in
    </button>
  );

  const signedInState = () => {
    const userRole = String(user?.publicMetadata?.role);
    return (
      <Router>
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
      </Router>
    );
  };

  return (
    <div className='App'>
      {!isSignedIn ? signedOutState() : signedInState()}
    </div>
  );
}

export default App;
