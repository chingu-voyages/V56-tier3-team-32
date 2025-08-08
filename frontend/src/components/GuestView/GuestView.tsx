import React, { useEffect, useState } from 'react';
import { getStatusColor, getStatusTextColor } from '../../utils/StatusColors';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import './GuestView.css';

type Patient = {
  patientId: string;
  statusCode: string;
  updatedAt?: string;
};

const ROWS = 2;
const COLS = 3;
const ENTRIES_PER_PAGE = ROWS * COLS;
const INTERVAL_MS = 10000;
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const GuestView: React.FC = () => {
  const { isSignedIn } = useUser();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOptionA, setShowOptionA] = useState(true);

  const navigate = useNavigate();

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
      document.body.classList.add('fullscreen-mode');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      document.body.classList.remove('fullscreen-mode');
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatLastUpdated = (updatedAt?: string) => {
    if (!updatedAt) return 'Unknown';

    const date = new Date(updatedAt);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const timeString = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    if (date >= today) return `Today at ${timeString}`;
    if (date >= yesterday) return `Yesterday at ${timeString}`;

    const dateString = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    return `${dateString} at ${timeString}`;
  };

  const PatientCard = ({
    patient,
    isFullscreen = false,
  }: {
    patient: Patient;
    isFullscreen?: boolean;
  }) => {
    const bgColor = getStatusColor(patient.statusCode);
    const cardClasses = isFullscreen
      ? 'patient-card-fullscreen'
      : 'patient-card-regular';

    return (
      <div className={cardClasses} style={{ backgroundColor: bgColor }}>
        <div
          className={`patient-card-content ${
            !isFullscreen ? 'patient-card-content-regular' : ''
          }`}
        >
          <p
            className={
              isFullscreen
                ? 'patient-card-id-fullscreen'
                : 'patient-card-id-regular'
            }
          >
            {patient.patientId}
          </p>
          <p
            className={
              isFullscreen
                ? 'patient-card-status-fullscreen'
                : 'patient-card-status-regular'
            }
          >
            {patient.statusCode}
          </p>
        </div>
        <p className='patient-card-updated'>
          Updated: {formatLastUpdated(patient.updatedAt)}
        </p>
      </div>
    );
  };

  const TableHeader = ({
    isFullscreen = false,
  }: {
    isFullscreen?: boolean;
  }) => {
    const headerClasses = isFullscreen
      ? 'table-header-cell-fullscreen'
      : 'table-header-cell-regular';

    return (
      <thead className='table-header'>
        <tr className='table-header-row'>
          <th className={headerClasses}>Patient ID</th>
          <th className={headerClasses}>Status</th>
          <th className={headerClasses}>Last Updated</th>
        </tr>
      </thead>
    );
  };

  const legendAndFooter = () => (
    <>
      <div className='legend-container'>
        <h3 className='legend-title'>Status Legend</h3>
        <div className='legend-grid'>
          {[
            'Checked In',
            'Pre-Procedure',
            'In-Progress',
            'Closing',
            'Recovery',
            'Complete',
            'Dismissal',
          ].map((status) => (
            <div key={status} className='legend-item'>
              <div
                className='legend-color'
                style={{ backgroundColor: getStatusColor(status) }}
              />
              <span className='legend-text'>{status}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='footer-container'>
        <p>
          {new Date().toLocaleString(undefined, {
            dateStyle: 'short',
            timeStyle: 'short',
          })}
        </p>
        <p className='footer-emergency'>
          For medical emergencies, please contact hospital staff immediately.
        </p>
      </div>
    </>
  );

  const renderPatientCards = (isFullscreen = false) => {
    return (
      <div className='cards-grid'>
        {displayedPatients.map((patient, idx) => {
          if (!patient) return <div key={idx} />;
          return (
            <PatientCard
              key={idx}
              patient={patient}
              isFullscreen={isFullscreen}
            />
          );
        })}
      </div>
    );
  };

  const renderPatientTable = (isFullscreen = false) => {
    return (
      <div className='table-container'>
        <table className='table'>
          <TableHeader isFullscreen={isFullscreen} />
          <tbody>
            {displayedPatients.map((patient, idx) => {
              if (!patient) return <div key={idx} />;
              return (
                <tr key={idx} className='table-row'>
                  <td className='table-cell-id'>{patient.patientId}</td>
                  <td className='table-cell-status'>
                    <span
                      className='status-badge'
                      style={{
                        backgroundColor: getStatusColor(patient.statusCode),
                        color: getStatusTextColor(patient.statusCode),
                      }}
                    >
                      {patient.statusCode}
                    </span>
                  </td>
                  <td className='table-cell-updated'>
                    {formatLastUpdated(patient.updatedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const OptionA = () => {
    if (isFullscreen) {
      return (
        <div className='layout-fullscreen'>
          <div className='header-section-fullscreen'>
            <h1 className='title-fullscreen'>Surgery Status Board</h1>
          </div>
          <div className='header-section-content'>
            <div className='content-wrapper-fullscreen'>
              {renderPatientCards(true)}
            </div>
          </div>
          <div className='header-section-footer'>{legendAndFooter()}</div>
        </div>
      );
    }

    return (
      <div className='layout-regular'>
        <div className='layout-flex-column'>
          <div className='layout-content-card'>
            <div className='layout-content-container'>
              <h1 className='title-regular '>Surgery Status Board</h1>
              {renderPatientCards()}
            </div>
          </div>
        </div>
        {legendAndFooter()}
      </div>
    );
  };

  const OptionB = () => {
    if (isFullscreen) {
      return (
        <div className='layout-fullscreen'>
          <div className='header-section-fullscreen'>
            <h2 className='title-fullscreen'>Surgery Status Board</h2>
          </div>
          <div className='header-section-content'>
            <div className='content-wrapper-table'>
              {renderPatientTable(true)}
            </div>
          </div>
          <div className='header-section-footer'>{legendAndFooter()}</div>
        </div>
      );
    }

    return (
      <div className='layout-regular'>
        <div className='layout-flex-column'>
          <div className='layout-table-card'>
            <div className='layout-table-container'>
              <h2 className='title-regular'>Surgery Status Board</h2>
              {renderPatientTable()}
            </div>
          </div>
        </div>
        {legendAndFooter()}
      </div>
    );
  };

  const ControlButtons = () => (
    <div className='control-buttons-container'>
      <div className='control-buttons-group'>
        <button
          onClick={() => setShowOptionA(true)}
          className={`option-button ${
            showOptionA ? 'option-button-active' : 'option-button-inactive'
          }`}
        >
          Option A
        </button>
        <button
          onClick={() => setShowOptionA(false)}
          className={`option-button ${
            !showOptionA ? 'option-button-active' : 'option-button-inactive'
          }`}
        >
          Option B
        </button>
      </div>
      <div className='control-buttons-group'>
        <button onClick={toggleFullscreen} className='fullscreen-button'>
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
        </button>
        {!isSignedIn && (
          <button onClick={() => navigate('/login')} className='login-button'>
            Log In
          </button>
        )}
      </div>
    </div>
  );

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);

      if (isCurrentlyFullscreen) {
        document.body.classList.add('fullscreen-mode');
      } else {
        document.body.classList.remove('fullscreen-mode');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.body.classList.remove('fullscreen-mode');
    };
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/patients/anonymized`)
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch(() => setPatients([]));
  }, []);

  useEffect(() => {
    if (patients.length === 0) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev === 0 ? patients.length - 1 : prev - 1));
    }, INTERVAL_MS);
    return () => clearInterval(interval);
  }, [patients.length]);

  const displayedPatients = Array.from({ length: ENTRIES_PER_PAGE }, (_, i) => {
    return patients.length > 0
      ? patients[(startIndex + i) % patients.length]
      : undefined;
  });

  return (
    <div
      className={
        isFullscreen ? 'guest-view-fullscreen' : 'guest-view-container'
      }
    >
      {isFullscreen ? (
        showOptionA ? (
          <OptionA />
        ) : (
          <OptionB />
        )
      ) : (
        <div className='guest-view-content'>
          <div className='guest-header-card'>
            <div className='guest-header-content'>
              <div>
                <h1 className='guest-header-text'>Surgery Status Board</h1>
                <p className='guest-header-description'>
                  Real-time updates on surgery schedules and patient status
                </p>
              </div>
              <div className='guest-header-controls'>
                <ControlButtons />
              </div>
            </div>
          </div>
          {showOptionA ? <OptionA /> : <OptionB />}
        </div>
      )}
    </div>
  );
};

export default GuestView;
