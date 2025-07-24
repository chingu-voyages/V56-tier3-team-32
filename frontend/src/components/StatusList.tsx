import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StatusList.css';
import { BASE_URL } from '../config';
import { getStatusColor, getStatusTextColor } from '../utils/StatusColors';

interface Status {
  _id: string;
  code: string;
  description: string;
}

const StatusList = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/statuses`)
      .then((res) => setStatuses(res.data))
      .catch((err) => {
        console.error('Error fetching statuses:', err);
        setError('Failed to fetch statuses. Please try again later.');
      });
  }, []);

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
