import './App.css';
import { UserButton, useUser, useClerk } from '@clerk/clerk-react';
import StatusList from './components/StatusList';

function App() {
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const signedOutState = () => (
    <button className="sign-in-button" onClick={() => openSignIn()}>Sign in</button>
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
