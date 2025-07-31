import { Routes, Route, Navigate } from 'react-router-dom';
import StatusList from '../components/StatusList/StatusList';
import PatientList from '../components/PatientList/PatientList';
import PatientForm from '../components/PatientForm/PatientForm';
import GuestView from '../components/GuestView/GuestView';

interface AppRoutesProps {
  userRole: string;
}

const AppRoutes = ({ userRole }: AppRoutesProps) => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/status' replace />} />
      <Route path='/status' element={<StatusList />} />
      <Route path='/patients' element={<PatientList />} />
      <Route path='/guest' element={<GuestView />} />
      {userRole === 'admin' && (
        <>
          <Route path='/new-patient' element={<PatientForm mode='create' />} />
        </>
      )}
      <Route path='*' element={<Navigate to='/status' replace />} />
    </Routes>
  );
};

export default AppRoutes;
