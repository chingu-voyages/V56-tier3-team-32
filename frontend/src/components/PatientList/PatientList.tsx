import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Patient } from '../../types/patient';
import { Status } from '../../types/status';
import { getStatusColor, getStatusTextColor } from '../../utils/StatusColors';
import PatientForm from '../PatientForm/PatientForm';
import './PatientList.css';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';
const PatientList = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const userRole = String(user?.publicMetadata?.role);
  const isAdmin = userRole === 'admin';
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formMode, setFormMode] = useState<'edit' | 'view' | null>(null);
  const [searchName,setSearchName]=useState<string | null>(null);
  
  useEffect(() => {
  let isMounted = true;

  const fetchPatientsAndStatuses = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const [patientsResponse, statusesResponse] = await Promise.all([
        axios.get(`${BASE_URL}/admin/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/statuses`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (isMounted) {
        setPatients(patientsResponse.data);
        setStatuses(statusesResponse.data);
        setError(null);
      }
    } catch (err) {
      if (isMounted) setError('Failed to fetch patient data.');
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  // Initial fetch
  fetchPatientsAndStatuses();

  return () => {
    isMounted = false;
  };
}, [getToken]);

useEffect(() => {
  const interval = setInterval(() => {
    setPatients(prev => 
      prev.map(patient => ({
        ...patient,
        statusDuration: calculateStatusDuration(patient.statusStartTime, patient.updatedAt)
      }))
    );
  }, 1000); // Update every second

  return () => clearInterval(interval);
}, []);

const calculateStatusDuration = (statusStartTime: string, updatedAt: string): string => {
  try {
  const now = new Date();
  const start = new Date(statusStartTime || updatedAt);
  
  if (isNaN(start.getTime())) {
    return '0m'; // Invalid date, return 0 minutes
  }

  const minutes = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
} catch (error) {
    console.error('Error calculating status duration:', error);
    return '0m'; // Fallback in case of error
  }
};

  const getStatusCode = (status: Patient['status']): string => {
    return status?.code ?? 'Unknown';
  };

  const handleStatusChange = async (patientId: string, newStatusId: string) => {
    const newStatus = statuses.find(status => status._id === newStatusId);
    if (!newStatus) return;

    setPatients((prev) =>
      prev.map((patient) =>
        patient.patientId === patientId 
          ? { 
            ...patient, 
            status: { code: newStatus.code },
            statusStartTime: new Date().toISOString(),
            statusDuration: '0m' 
          }
          : patient
      )
    );

    try {
      const token = await getToken();
      
      await axios.patch(
        `${BASE_URL}/admin/patients/${patientId}/status`,
        { statusId: newStatusId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setError(null);
    } catch (err) {
      setError('Failed to update patient status.');
    }
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormMode('edit');
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormMode('view');
  };

  const handleCloseForm = () => {
    setSelectedPatient(null);
    setFormMode(null);
  };

  const handleSavePatient = (updatedPatient: Patient) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient._id === updatedPatient._id ? updatedPatient : patient
      )
    );
    handleCloseForm();
  };
  
// handling search functionality 
  const handleSearchChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { value } = e.target;
      setSearchName(value);
    };
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
          const token = await getToken();
          const response= await axios.get(`${BASE_URL}/admin/search?lastName=${searchName}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          setPatients(response.data);
          setError(null);
        }catch (err) {
          setError('Failed to fetch patient data.');
        }
      }
  if (selectedPatient && formMode) {
    return (
      <PatientForm
        mode={formMode}
        patientData={selectedPatient}
        onSave={handleSavePatient}
        onCancel={handleCloseForm}
      />
    );
  }

  const patientData = () => (
    <table className='table'>
      <thead>
        <tr className='tablehead'>
          <th className='table-cell'>Patient Id</th>
          <th className='table-cell'>First Name</th>
          <th className='table-cell'>Last Name</th> 
          <th className='table-cell'>Status</th>
          <th className='table-cell'>Duration</th>
          {isAdmin && <th className='table-cell'>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {patients.map((patient) => {
          const statusCode = getStatusCode(patient.status);
          const currentStatus = statuses.find(status => status.code === statusCode);
          
          return (
            <tr key={patient._id} className='table-row'>
              <td className='table-cell'>{patient.patientId}</td>
              <td className='table-cell'>
                {patient.firstName}
              </td>
              <td className='table-cell'>
                {patient.lastName}
              </td>
              <td className='table-cell'>
                <select
                  value={currentStatus?._id || 'Unknown'}
                  onChange={(e) => handleStatusChange(patient.patientId, e.target.value)}
                  className='status-dropdown'
                  style={{
                    backgroundColor: getStatusColor(statusCode),
                    color: getStatusTextColor(statusCode),
                  }}
                >
                  {statuses.map((status) => (
                    <option key={status._id} value={status._id}>
                      {status.code}
                    </option>
                  ))}
                </select>
              </td>
              <td className='table-cell'>
                {patient.statusDuration}
              </td>
              {isAdmin && (
                <td className='table-cell'>
                  <button
                    className='edit-button'
                    aria-label='Edit Patient Details'
                    onClick={() => handleEditPatient(patient)}
                  >
                    Edit
                  </button>
                  <button
                    className='view-button'
                    aria-label='View Patient Details'
                    onClick={() => handleViewPatient(patient)}
                  >
                    View
                  </button>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
      {/* TODO(Maybe): Search/filter functionality */}
      {/* TODO(Maybe): Add pagination if needed */}
    </table>
  );

  return (
    <div className='mx-10'>
      <div className='search-container'>
      <form className='patient-form' onSubmit={handleSearch}>
          <p className='text-3xl font-semibold my-4 text-primary inline'>
            Search Patient
          </p>
          <input
            type='text'
            id='firstName'
            name='firstName'
            placeholder='Enter Last Name'
            onChange={handleSearchChange}
          />
          <button type='submit' className='submit-btn' disabled={loading}>Search</button>
      </form>
      </div>
      <hr />
      <h1 className='text-3xl font-semibold my-4 text-primary text-center'>
        Patient List
      </h1>

      {loading ? (
        <p className='loading-text'>Loading patients...</p>
      ) : error ? (
        <p className='error-text'>{error}</p>
      ) : patients.length===0? (
        <p className='error-text'>No patients found with that last name</p>
      ):(
        patientData()
      )}
    </div>
  );
};

export default PatientList;
