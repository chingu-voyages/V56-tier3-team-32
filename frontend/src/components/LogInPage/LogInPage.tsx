import React from 'react';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const LogInPage: React.FC = () => {
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const handleSignIn = () => {
    openSignIn({
      afterSignInUrl: '/dashboard',
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold text-primary mb-4'>
            Admin/Surgery Team Login
          </h2>
          <p className='text-gray-600 mb-6'>
            Please sign in to access the dashboard
          </p>

          <button
            onClick={handleSignIn}
            className='w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200 mb-4'
          >
            Sign In
          </button>

          <button
            onClick={handleBack}
            className='w-full border border-primary text-primary py-3 px-4 rounded-md hover:bg-gray-50 transition-colors duration-200'
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
