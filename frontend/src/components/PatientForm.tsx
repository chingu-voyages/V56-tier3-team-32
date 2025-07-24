import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './PatientForm.css';
import { BASE_URL } from '../config';
import { Patient } from '../types/patient';

interface PatientFormProps {
  mode: 'create';
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

const PatientForm: React.FC<PatientFormProps> = ({ mode }) => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const handleCreateNewUser = async () => {
      if (mode === 'create') {
        try {
          const token = await getToken();
          const response = await axios.get(
            `${BASE_URL}/admin/generate-patient-id`,
            {
              headers: {
                Authorization: `Bearer ${token} `,
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
  }, [getToken]);

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
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      const response = await axios.post(
        `${BASE_URL}/admin/newPatient`,
        patient,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage('Patient has been successfully created.');
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error creating patient:', err);
      setError('Failed to create patient');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/patients');
  };

  const handleCancel = () => {
    setPatient(initialState);
    navigate('/patients');
  };

  const getFormTitle = () => 'Register New Patient';

  return (
    <>
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
              readOnly
              className='readyonly-input'
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
              required
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
              required
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
              required
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
              required
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
              required
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
              required
            />
          </div>
          <div>
            <label htmlFor='telephone'>Telephone:</label>
            <br />
            <input
              type='text'
              id='telephone'
              name='telephone'
              value={patient.telephone}
              onChange={handleChange}
              required
              pattern='^\d{4,}$'
              minLength={4}
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
              required
            />
          </div>

          <div>
            <label htmlFor='status'>Status:</label>
            <br />
            <input
              type='text'
              id='status'
              name='status'
              value={'Checked In'}
              readOnly
              className='readonly-input'
            />
          </div>

          <div className='form-actions'>
            <button
              type='button'
              onClick={handleCancel}
              className='cancel-btn'
              disabled={loading}
            >
              Cancel
            </button>
            <button type='submit' className='submit-btn' disabled={loading}>
              {loading ? 'Saving...' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>

      {showSuccessModal && (
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
      )}
    </>
  );
};

export default PatientForm;
