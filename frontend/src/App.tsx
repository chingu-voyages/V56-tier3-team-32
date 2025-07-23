import './App.css';
import { UserButton, useUser, useClerk } from '@clerk/clerk-react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import StatusList from './components/StatusList';
import PatientList from './components/PatientList';
import MenuSideBar from './components/MenuSideBar';

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
        <div className='flex min-h-screen bg-background'>
          <MenuSideBar userRole={userRole} />
          <div className='flex-1'>
            <header className='bg-white shadow-sm border-b border-border-line p-4 flex justify-end items-center'>
              <div className='flex items-center gap-4'>
                {user && (
                  <p className='text-font-secondary'>
                    Welcome, {user.username} ({userRole})
                  </p>
                )}
                <UserButton />
              </div>
            </header>
            <main className='p-6'>
              <Routes>
                <Route path='/' element={<Navigate to='/status' replace />} />
                <Route path='/status' element={<StatusList />} />
                {userRole === 'admin' && (
                  <Route path='/patients' element={<PatientList />} />
                )}
                <Route path='*' element={<Navigate to='/status' replace />} />
              </Routes>
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
