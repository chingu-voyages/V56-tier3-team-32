import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './PatientForm.css';
import { BASE_URL } from '../config';
import { Patient } from '../types/patient';
import { Status } from '../types/status';

interface PatientFormProps {
  mode: 'create' | 'view' | 'edit';
  patientData?: Patient | null;
  onSave?: (patient: Patient) => void;
  onCancel?: () => void;
}

const initialState: Omit<Patient, '_id' | 'createdAt' | 'status'> = {
  patientId: '',
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  country: '',
  telephone: 0,
  contactEmail: '',
};

const PatientForm: React.FC<PatientFormProps> = ({
  mode,
  patientData,
  onSave,
  onCancel,
}) => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(initialState);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // generate patient ID for create mode
  useEffect(() => {
    const handleCreateNewUser = async () => {
      if (mode === 'create') {
        try {
          const token = await getToken();
          const response = await axios.get(
            `${BASE_URL}/admin/generate-patient-id`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response);

          setPatient((prev) => ({
            ...prev,
            patientId: response.data.patientId,
          }));
        } catch (err: any) {
          console.error('Error generating new patient ID:', err);
        }
      }
    };
    handleCreateNewUser();
  }, [mode, getToken]);

  // fetch statuses for edit mode
  useEffect(() => {
    const fetchStatuses = async () => {
      if (mode === 'edit') {
        try {
          const token = await getToken();
          const response = await axios.get(`${BASE_URL}/statuses`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('statuses: ', response.data);
          setStatuses(response.data);
        } catch (err: any) {
          console.error('Error fetching statuses:', err);
          setError('Failed to fetch statuses');
        }
      }
    };
    fetchStatuses();
  }, [mode, getToken]);

  // load patient data for edit/view mode
  useEffect(() => {
    if ((mode === 'view' || mode === 'edit') && patientData) {
      const statusValue =
        typeof patientData.status === 'string'
          ? patientData.status
          : patientData.status.code;

      setPatient({
        patientId: patientData.patientId,
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        street: patientData.street,
        city: patientData.city,
        state: patientData.state,
        country: patientData.country,
        telephone: patientData.telephone,
        contactEmail: patientData.contactEmail,
      });
      if (mode === 'edit') {
        setSelectedStatus(statusValue);
      }
    }
  }, [mode, patientData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPatient((prev) => ({
      ...prev,
      [name]: name === 'telephone' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;

    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      let response;

      if (mode === 'create') {
        response = await axios.post(`${BASE_URL}/admin/newPatient`, patient, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccessMessage('Patient has been successfully created.');
      } else if (mode === 'edit') {
        const updatePatient = {
          ...patient,
          status: selectedStatus,
        };
        // TODO: update with correct endpoint after backend api
        response = await axios.put(
          `${BASE_URL}/admin/editPatientInfo/${patientData?._id}`,
          updatePatient,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccessMessage('Patient has been successfully updated.');
      }

      if (onSave && response) {
        onSave(response.data);
      }
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error saving patient:', err);
      setError('Failed to save patient');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/patients');
  };

  const handleCancel = () => {
    if (mode === 'create') {
      setPatient(initialState);
    }
    if (onCancel) {
      onCancel();
    } else {
      navigate('/patients');
    }
  };

  const getCurrentStatus = () => {
    if (mode === 'create') return 'Checked In';
    if (patientData?.status) {
      return typeof patientData.status === 'string'
        ? patientData.status
        : patientData.status.code;
    }
    return 'Checked In';
  };

  const getFormTitle = () => {
    switch (mode) {
      case 'create':
        return 'Register New Patient';
      case 'view':
        return 'View Patient Details';
      case 'edit':
        return 'Edit Patient Details';
      default:
        return 'Patient Form';
    }
  };

  const isReadOnly = mode === 'view';

  const renderPatientForm = () => (
    <div className='form-container'>
      <form className='patient-form' onSubmit={handleSubmit}>
        <h3>{getFormTitle()}</h3>

        {error && <div className='error-message'>{error}</div>}

        <div>
          <label htmlFor='patientId'>Patient No.:</label>
          <br />
          <input
            type='text'
            id='patientId'
            name='patientId'
            value={patient.patientId}
            onChange={handleChange}
            readOnly
            className='readonly-label'
          />
        </div>
        <div>
          <label htmlFor='firstName'>First Name:</label>
          <br />
          <input
            type='text'
            id='firstName'
            name='firstName'
            value={patient.firstName}
            onChange={handleChange}
            readOnly={isReadOnly}
            required={!isReadOnly}
            className={isReadOnly ? 'readonly-label' : ''}
          />
        </div>
        <div>
          <label htmlFor='lastName'>Last Name:</label>
          <br />
          <input
            type='text'
            id='lastName'
            name='lastName'
            value={patient.lastName}
            onChange={handleChange}
            readOnly={isReadOnly}
            required={!isReadOnly}
            className={isReadOnly ? 'readonly-label' : ''}
          />
        </div>
        <div>
          <label htmlFor='street'>Street:</label>
          <br />
          <input
            type='text'
            id='street'
            name='street'
            value={patient.street}
            onChange={handleChange}
            readOnly={isReadOnly}
            required={!isReadOnly}
            className={isReadOnly ? 'readonly-label' : ''}
          />
        </div>
        <div>
          <label htmlFor='city'>City:</label>
          <br />
          <input
            type='text'
            id='city'
            name='city'
            value={patient.city}
            onChange={handleChange}
            readOnly={isReadOnly}
            required={!isReadOnly}
            className={isReadOnly ? 'readonly-label' : ''}
          />
        </div>
        <div>
          <label htmlFor='state'>State:</label>
          <br />
          <input
            type='text'
            id='state'
            name='state'
            value={patient.state}
            onChange={handleChange}
            readOnly={isReadOnly}
            required={!isReadOnly}
            className={isReadOnly ? 'readonly-label' : ''}
          />
        </div>
        <div>
          <label htmlFor='country'>Country:</label>
          <br />
          <input
            type='text'
            id='country'
            name='country'
            value={patient.country}
            onChange={handleChange}
            readOnly={isReadOnly}
            required={!isReadOnly}
            className={isReadOnly ? 'readonly-label' : ''}
          />
        </div>
        <div>
          <label htmlFor='telephone'>Telephone:</label>
          <br />
          <input
            type='text'
            id='telephone'
            name='telephone'
            value={patient.telephone !== null && patient.telephone !== undefined ? String(patient.telephone) : ''}
            onChange={handleChange}
            readOnly={isReadOnly}
            required={!isReadOnly}
            className={isReadOnly ? 'readonly-label' : ''}
          />
        </div>
        <div>
          <label htmlFor='contactEmail'>Email:</label>
          <br />
          <input
            type='email'
            id='contactEmail'
            name='contactEmail'
            value={patient.contactEmail}
            onChange={handleChange}
            readOnly={isReadOnly}
            required={!isReadOnly}
            className={isReadOnly ? 'readonly-label' : ''}
          />
        </div>

        <div>
          <label htmlFor='status'>Status:</label>
          <br />
          {mode === 'create' || isReadOnly ? (
            <input
              type='text'
              id='status'
              name='status'
              value={getCurrentStatus()}
              readOnly
              className='readonly-label'
            />
          ) : (
            <select
              name='status'
              id='status'
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              required
            >
              {statuses.map((status) => (
                <option key={status._id} value={status.code}>
                  {status.code}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className='form-actions'>
          <button
            type='button'
            onClick={handleCancel}
            className='cancel-btn'
            disabled={loading}
          >
            {mode === 'view' ? 'Close' : 'Cancel'}
          </button>
          {mode !== 'view' && (
            <button type='submit' className='submit-btn' disabled={loading}>
              {loading
                ? 'Saving...'
                : mode === 'create'
                ? 'Add Patient'
                : 'Update Patient'}
            </button>
          )}
        </div>
      </form>
    </div>
  );

  const renderSuccessModal = () => (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2>Success!</h2>
        </div>
        <div className='modal-body'>
          <p>{successMessage}</p>
        </div>
        <div className='modal-footer'>
          <button
            className='modal-btn-primary'
            onClick={handleSuccessModalClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {renderPatientForm()}
      {showSuccessModal && renderSuccessModal()}
    </>
  );
};

export default PatientForm;
