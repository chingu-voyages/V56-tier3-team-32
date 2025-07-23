import './App.css';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import StatusList from './components/StatusList';

function App() {
  const { user, isSignedIn } = useUser();

  const signedOutState = () => (
    <div>
      <SignInButton />
      <SignUpButton />
    </div>
  );

  const signedInState = () => (
    <div>
      <UserButton />
      {user && (
        <p>
          You are {user.username}. You are {String(user.publicMetadata?.role)}.
        </p>
      )}
    </div>
  );

  return (
    <div className="App">
      <header>
        {!isSignedIn ? signedOutState() : signedInState()}
      </header>
      <main>
        <StatusList />
      </main>
    </div>
  );
}

export default App;
