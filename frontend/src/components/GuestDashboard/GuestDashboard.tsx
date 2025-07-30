import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatusColor, getStatusTextColor } from '../../utils/StatusColors';

interface DemoPatient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  status: string;
}

const GuestDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Hardcoded demo data
  const demoPatients: DemoPatient[] = [
    {
      id: '1',
      patientId: 'P001',
      firstName: 'John',
      lastName: 'Smith',
      status: 'In-Progress',
    },
    {
      id: '2',
      patientId: 'P002',
      firstName: 'Maria',
      lastName: 'Garcia',
      status: 'Pre-Procedure',
    },
    {
      id: '3',
      patientId: 'P003',
      firstName: 'David',
      lastName: 'Johnson',
      status: 'Recovery',
    },
    {
      id: '4',
      patientId: 'P004',
      firstName: 'Sarah',
      lastName: 'Wilson',
      status: 'Checked In',
    },
    {
      id: '5',
      patientId: 'P005',
      firstName: 'Michael',
      lastName: 'Brown',
      status: 'Closing',
    },
    {
      id: '6',
      patientId: 'P006',
      firstName: 'Emily',
      lastName: 'Davis',
      status: 'Dismissal',
    },
  ];

  const handleBack = () => {
    navigate('/login');
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Enter fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Listen for fullscreen changes from browser (F11, ESC, etc.)
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Fullscreen view - only table
  if (isFullscreen) {
    return (
      <div className='min-h-screen bg-gray-50 p-4'>
        <div className='h-full flex flex-col'>
          {/* Minimal header with exit button */}
          <div className='flex justify-between items-center mb-4 px-4'>
            <h1 className='text-4xl font-bold text-[#492470]'>
              Surgery Status Dashboard
            </h1>
          </div>

          {/* Full screen table */}
          <div className='flex-1 bg-white rounded-lg shadow-md p-6'>
            <div className='h-full flex flex-col'>
              <h2 className='text-3xl font-semibold text-[#492470] mb-6 text-center'>
                Current Patient Status
              </h2>

              <div className='flex-1 overflow-auto'>
                <table className='w-full border-collapse border border-gray-200 text-lg'>
                  <thead>
                    <tr className='bg-gray-50'>
                      <th className='border border-gray-200 px-6 py-4 text-center font-semibold text-gray-700 text-xl'>
                        Patient ID
                      </th>
                      <th className='border border-gray-200 px-6 py-4 text-center font-semibold text-gray-700 text-xl'>
                        Patient Name
                      </th>
                      <th className='border border-gray-200 px-6 py-4 text-center font-semibold text-gray-700 text-xl'>
                        Current Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoPatients.map((patient) => (
                      <tr
                        key={patient.id}
                        className='hover:bg-gray-50 transition-colors duration-150'
                      >
                        <td className='border border-gray-200 px-6 py-4 font-medium text-gray-900 text-center text-xl'>
                          {patient.patientId}
                        </td>
                        <td className='border border-gray-200 px-6 py-4 text-gray-700 text-center text-xl'>
                          {patient.firstName} {patient.lastName}
                        </td>
                        <td className='border border-gray-200 px-6 py-4 text-center'>
                          <span
                            className='inline-block px-4 py-2 rounded text-lg font-medium w-[150px] text-center'
                            style={{
                              backgroundColor: getStatusColor(patient.status),
                              color: getStatusTextColor(patient.status),
                            }}
                          >
                            {patient.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className='mt-8 p-4 bg-gray-50 rounded-lg'>
                <h3 className='text-lg font-semibold text-gray-700 mb-3'>
                  Status Legend
                </h3>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3'>
                  {[
                    'Checked In',
                    'Pre-Procedure',
                    'In-Progress',
                    'Closing',
                    'Recovery',
                    'Complete',
                    'Dismissal',
                  ].map((status) => (
                    <div key={status} className='flex items-center space-x-2'>
                      <div
                        className='w-4 h-4 rounded'
                        style={{ backgroundColor: getStatusColor(status) }}
                      ></div>
                      <span className='text-sm text-gray-700'>{status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Large timestamp at bottom */}
              <div className='mt-6 text-center text-lg text-gray-500 border-t pt-4'>
                <p>{new Date().toLocaleString()}</p>
                <p className='mt-1'>
                  For medical emergencies, please contact hospital staff
                  immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal view
  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-6xl mx-auto'>
        {/* Header Section */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <div className='flex justify-between items-center mb-4'>
            <div>
              <h1 className='text-3xl font-bold text-[#492470]'>
                Surgery Status Dashboard
              </h1>
              <p className='text-gray-600 mt-2'>
                Real-time updates on surgery schedules and patient status
              </p>
            </div>
            <div className='flex gap-3'>
              <button
                onClick={toggleFullscreen}
                className='px-4 py-2 bg-[#492470] text-white rounded-md hover:bg-[#67369c] transition-colors duration-200 font-medium'
              >
                Fullscreen View
              </button>
              <button
                onClick={handleBack}
                className='px-6 py-2 border-2 border-[#492470] text-[#492470] rounded-md hover:bg-gray-50 transition-colors duration-200 font-medium'
              >
                Log In
              </button>
            </div>
          </div>

          {/* Demo Notice */}
          <div className='bg-blue-50 border border-blue-200 rounded-md p-4 mb-4'>
            <p className='text-blue-800 text-sm'>
              <strong>Demo Mode:</strong> This is a demonstration dashboard
              showing sample patient data.
            </p>
          </div>
        </div>

        {/* Patient Status Table */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-2xl font-semibold text-[#492470] mb-6'>
            Current Patient Status
          </h2>

          <div className='overflow-x-auto'>
            <table className='w-full border-collapse border border-gray-200'>
              <thead>
                <tr className='bg-gray-50'>
                  <th className='border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700'>
                    Patient ID
                  </th>
                  <th className='border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700'>
                    Patient Name
                  </th>
                  <th className='border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700'>
                    Current Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {demoPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className='hover:bg-gray-50 transition-colors duration-150'
                  >
                    <td className='border border-gray-200 px-4 py-3 font-medium text-gray-900 text-center'>
                      {patient.patientId}
                    </td>
                    <td className='border border-gray-200 px-4 py-3 text-gray-700 text-center'>
                      {patient.firstName} {patient.lastName}
                    </td>
                    <td className='border border-gray-200 px-4 py-3 text-center'>
                      <span
                        className='inline-block px-2 py-1 rounded w-[125px] text-center font-medium'
                        style={{
                          backgroundColor: getStatusColor(patient.status),
                          color: getStatusTextColor(patient.status),
                        }}
                      >
                        {patient.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Status Legend */}
          <div className='mt-8 p-4 bg-gray-50 rounded-lg'>
            <h3 className='text-lg font-semibold text-gray-700 mb-3'>
              Status Legend
            </h3>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3'>
              {[
                'Checked In',
                'Pre-Procedure',
                'In-Progress',
                'Closing',
                'Recovery',
                'Complete',
                'Dismissal',
              ].map((status) => (
                <div key={status} className='flex items-center space-x-2'>
                  <div
                    className='w-4 h-4 rounded'
                    style={{ backgroundColor: getStatusColor(status) }}
                  ></div>
                  <span className='text-sm text-gray-700'>{status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className='mt-6 text-center text-sm text-gray-500'>
            <p>{new Date().toLocaleString()}</p>
            <p className='mt-1'>
              For medical emergencies, please contact hospital staff
              immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;
