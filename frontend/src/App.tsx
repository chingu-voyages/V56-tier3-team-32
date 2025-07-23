import './App.css';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import StatusList from './components/StatusList';

function App() {
  const { user } = useUser();

  return (
    <div className="App">
      <header>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
          {user && (
            <p>
              You are {user.username}. You are {user.publicMetadata?.role}.
            </p>
          )}
        </SignedIn>
      </header>
      <main>
        <StatusList />
      </main>
    </div>
  );
}

export default App;
