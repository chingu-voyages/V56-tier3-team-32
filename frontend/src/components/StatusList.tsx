import { useEffect, useState } from 'react';
import axios from 'axios';
import './StatusList.css';
import { BASE_URL } from '../config';

interface Status {
  _id: string;
  code: string;
  description: string;
}

const statusColors: Record<string, string> = {
  'Checked In': '#ffcc00',
  'Pre-Procedure': '#33b5e5',
  'In-Progress': '#ff4444',
  'Closing': '#aa66cc',
  'Recovery': '#00C851',
  'Complete': '#2BBBAD',
  'Dismissal': '#576574',
};

const StatusList = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/statuses`)
      .then((res) => setStatuses(res.data))
      .catch((err) => {
        console.error('Error fetching statuses:', err);
        setError('Failed to fetch statuses. Please try again later.');
      });
  }, []);

  return (
    <div className='status-container'>
      
    <div className="grid grid-cols-2 gap-4 p-4 status-box">
      <h4>
        Status List
      </h4>
      {error ? (
        <div className="error-message">
          {error}
        </div>
      ) : (
        statuses.map((status) => (
          <div
            key={status._id}
            title={status.description}
            className="status-codes"
            style={{ backgroundColor: statusColors[status.code] || '#ccc' }}
          >
            {status.code}
          </div>
        ))
      )}
    </div>
    </div>
  );
};

export default StatusList;