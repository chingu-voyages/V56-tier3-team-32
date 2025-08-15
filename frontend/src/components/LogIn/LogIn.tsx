import React, { useState, useEffect } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './LogIn.css';

const LogIn: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const hourInterval = 60 * 60 * 1000;
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, hourInterval);
    return () => clearInterval(timer);
  }, []);

  const { openSignIn } = useClerk();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await openSignIn({
        afterSignInUrl: '/',
        redirectUrl: '/',
      });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className='login-container'>
      <div className='login-header'>
        <div className='login-header-text'>
          <h1 className='header-title'>SurgeVenger Status Board</h1>
          <p className='header-date'>
            {currentDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}{' '}
          </p>
        </div>
      </div>

      <div className='login-card'>
        <div className='login-content'>
          <h2 className='content-title'>Track surgery progress with ease</h2>
          <p className='content-description'>
            Stay informed on patient status throughout their surgical journey
            with our SurgeVenger Status Board.
          </p>
          <a
            href='https://github.com/chingu-voyages/V56-tier3-team-32/tree/main'
            target='_blank'
            rel='noopener noreferrer'
            className='git-link'
          >
            GitHub
          </a>
        </div>

        <div className='login-form'>
          <div className='form-section'>
            <h3 className='section-title'>Log In</h3>
            <p className='section-description'>
              For Admin and Surgery Team members only
            </p>

            <div className='login-buttons'>
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className='primary-btn'
              >
                {isLoading ? (
                  <div className='loading-spinner'></div>
                ) : (
                  'Sign In'
                )}
              </button>
              <button className='secondary-btn' onClick={handleBack}>
                Back to Status Board
              </button>
            </div>
          </div>

          <div className='divider'>
            <span className='divider-text'>
              Note: Login access is restricted to authorized staff and
              administrators only.
            </span>
          </div>

          <div className='help-section'>
            <p className='help-text'>
              Need credentials? Contact your team leader or admin.
            </p>
          </div>
        </div>
      </div>
      <div className='login-footer'>
        <p className='footer-text'>© 2024 SurgeVenger. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LogIn;
