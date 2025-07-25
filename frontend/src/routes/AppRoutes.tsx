import { Routes, Route, Navigate } from 'react-router-dom';
import StatusList from '../components/StatusList';
import PatientList from '../components/PatientList';
import PatientForm from '../components/PatientForm';

interface AppRoutesProps {
  userRole: string;
}

const AppRoutes = ({ userRole }: AppRoutesProps) => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/status' replace />} />
      <Route path='/status' element={<StatusList />} />
      {userRole === 'admin' && (
        <>
          <Route path='/patients' element={<PatientList />} />
          <Route path='/new-patient' element={<PatientForm mode='create' />} />
        </>
      )}
      <Route path='*' element={<Navigate to='/status' replace />} />
    </Routes>
  );
};

export default AppRoutes;
