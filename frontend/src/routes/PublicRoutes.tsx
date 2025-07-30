import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import HomePageA from '../components/HomePageDemo/HomePageA';
import LogInPage from '../components/LogInPage/LogInPage';
import GuestDashboard from '../components/GuestDashboard/GuestDashboard';

const PublicRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePageA />} />
        <Route path='/login' element={<LogInPage />} />
        <Route path='/guest-dashboard' element={<GuestDashboard />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Router>
  );
};

export default PublicRoutes;
