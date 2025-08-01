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

interface StatusCount {
  status: string;
  count: number;
}

const StatusList = () => {
  const { getToken } = useAuth();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStatuses = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const [statusesRes, countsRes] = await Promise.all([
          axios.get(`${BASE_URL}/statuses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/patients/countbystatus`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setStatuses(statusesRes.data);
        const counts: Record<string, number> = {};
        countsRes.data.forEach((item: StatusCount) => {
          counts[item.status] = item.count;
        });
        setStatusCounts(counts);
        setError(null);
      } catch (err) {
        console.error('Error fetching statuses or counts:', err);
        setError('Failed to fetch statuses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatuses();
  }, [getToken]);

  return (
    <div className="status-page">
      {isLoading ? (
        <div className="loading-indicator">Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        statuses.map((status) => (
          <div
            key={status._id}
            title={status.description}
            className="status-codes"
            style={{
              backgroundColor: getStatusColor(status.code),
              color: getStatusTextColor(status.code),
            }}
          >
            <span>{status.code}</span>
            <span className="glow-text">
              {statusCounts[status.code] ?? 0}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default StatusList;
