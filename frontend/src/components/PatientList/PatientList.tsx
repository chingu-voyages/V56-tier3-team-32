import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { Patient } from '../../types/patient';
import { getStatusColor, getStatusTextColor } from '../../utils/StatusColors';
import PatientForm from '../PatientForm/PatientForm';
import './PatientList.css';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';
const PatientList = () => {
  const { getToken } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formMode, setFormMode] = useState<'edit' | 'view' | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(`${BASE_URL}/admin/patients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatients(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch patient data.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [getToken]);

  const getStatusCode = (status: Patient['status']): string => {
    return status?.code ?? 'Unknown'; 
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

  // Patient List Table
  const patientData = () => (
    <table className='table'>
      <thead>
        <tr className='tablehead'>
          <th className='table-cell'>Patient Id</th>
          <th className='table-cell'>Name</th>
          <th className='table-cell'>Status</th>
          <th className='table-cell'>Actions</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((patient) => {
          const statusCode = getStatusCode(patient.status);
          return (
            <tr key={patient._id} className='table-row'>
              <td className='table-cell'>{patient.patientId}</td>
              <td className='table-cell'>
                {patient.firstName} {patient.lastName}
              </td>
              <td className='table-cell'>
                <div
                  className='status-badge'
                  style={{
                    backgroundColor: getStatusColor(statusCode),
                    color: getStatusTextColor(statusCode),
                  }}
                >
                  {statusCode}
                </div>
              </td>
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
      <h1 className='text-3xl font-semibold my-4 text-primary text-center'>
        Patient List
      </h1>

      {loading ? (
        <p className='loading-text'>Loading patients...</p>
      ) : error ? (
        <p className='error-text'>{error}</p>
      ) : (
        patientData()
      )}
    </div>
  );
};

export default PatientList;
