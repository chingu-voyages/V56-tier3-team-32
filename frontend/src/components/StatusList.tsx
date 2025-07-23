import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StatusList.css';

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

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/statuses`)
      .then((res) => setStatuses(res.data))
      .catch((err) => console.error('Error fetching statuses:', err));
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {statuses.map((status) => (
        <div
          key={status._id}
          title={status.description}
          className="status-codes"
          style={{ backgroundColor: statusColors[status.code] || '#ccc' }}
        >
          {status.code}
        </div>
      ))}
    </div>
  );
};

export default StatusList;