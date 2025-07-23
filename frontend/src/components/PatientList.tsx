import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import { Patient } from '../types/patient';
import { getStatusColor, getStatusTextColor } from '../utils/StatusColors';

const PatientList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/admin/patients`);
        setPatients(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch patient data.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const getStatusCode = (status: Patient['status']): string => {
    if (typeof status === 'string') return status;
    if (status && typeof status === 'object' && 'code' in status)
      return status.code;
    return 'Unknown';
  };

  return (
    <div className='patient-list-container mx-10'>
      <h1 className='text-3xl font-semibold my-4 text-primary text-center'>
        Patient List
      </h1>

      {loading && <p className='text-primary'>Loading patients...</p>}
      {error && <p className='text-red-500'>{error}</p>}

      {!loading && !error && (
        <table className='border-2 border-border-line w-full'>
          <thead>
            <tr className='text-primary'>
              <th className='border p-2'>Patient Id</th>
              <th className='border p-2'>Name</th>
              <th className='border p-2'>Status</th>
              <th className='border p-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => {
              const statusCode = getStatusCode(patient.status);
              return (
                <tr
                  key={patient.patientId}
                  className='text-center hover:bg-hover'
                >
                  <td className='border p-2'>{patient.patientId}</td>
                  <td className='border p-2'>
                    {patient.firstName} {patient.lastName}
                  </td>
                  <td className='border p-2 font-medium rounded'>
                    <div
                      className='inline-block px-2 py-1 rounded w-[125px] text-center'
                      style={{
                        backgroundColor: getStatusColor(statusCode),
                        color: getStatusTextColor(statusCode),
                      }}
                    >
                      {statusCode}
                    </div>
                  </td>
                  <td className='border p-2'>
                    <button className='border border-primary hover:bg-primary hover:text-hover px-2 py-1 rounded-md'>
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {/* TODO(Maybe): Search/filter functionality */}
      {/* TODO(Maybe): Add pagination if needed */}
    </div>
  );
};

export default PatientList;
