import GuestView from '../components/GuestView/GuestView';
import LogIn from '../components/LogIn/LogIn';
import { Routes, Route, Navigate } from 'react-router-dom';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<GuestView />} />
      <Route path='/login' element={<LogIn />} />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
};

export default PublicRoutes;
