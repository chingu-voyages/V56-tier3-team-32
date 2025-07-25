import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import './StatusList.css';
import { getStatusColor, getStatusTextColor } from '../../utils/StatusColors';

interface Status {
  _id: string;
  code: string;
  description: string;
}
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';
const StatusList = () => {
  const { getToken } = useAuth();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(`${BASE_URL}/statuses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStatuses(response.data);
      } catch (err) {
        console.error('Error fetching statuses:', err);
        setError('Failed to fetch statuses. Please try again later.');
      }
    };
    fetchStatuses();
  }, [getToken]);

  return (
    <div className='grid grid-cols-2 gap-4 p-4'>
      {error ? (
        <div className='error-message'>{error}</div>
      ) : (
        statuses.map((status) => (
          <div
            key={status._id}
            title={status.description}
            className='status-codes'
            style={{
              backgroundColor: getStatusColor(status.code),
              color: getStatusTextColor(status.code),
            }}
          >
            {status.code}
          </div>
        ))
      )}
    </div>
  );
};

export default StatusList;
