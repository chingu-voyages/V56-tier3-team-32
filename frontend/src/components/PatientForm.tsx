import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PatientForm.css';
import { BASE_URL } from '../config'
interface Patient {
  patientId: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  telephone: string;
  contactEmail: string;
  status: string;
}

const initialState: Patient = {
  patientId: "",
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  country: '',
  telephone: '',
  contactEmail: '',
  status: '',
};

const PatientForm: React.FC = () => {
  const [patient, setPatient] = useState<Patient>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };


  const handleCreateNewUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/newPatient/generatepid`);
      console.log(response)
      setPatient({
        ...initialState,
        patientId: response.data, // Assuming patientId is a field
      });
    } catch (err) {
      console.error('Failed to generate patient ID', err);
      alert("Couldn't generate patient ID");
    }
  };
  useEffect(() => {
    handleCreateNewUser();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Patient Data:', patient);
    try {
      console.log("BASE URL: ", BASE_URL)
      console.log("in try")
      const response = await axios.post(`${BASE_URL}/admin/newPatient`, patient);
      console.log('after responce')
      console.log('Saved:', response.data);
      alert("Patient Registered Successfully!");
      setPatient(initialState);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Axios error:', err.response?.data || err.message);
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  const handleCancel = () => {
    setPatient(initialState);
  };

  return (<div className='form-container'>
    <form className="patient-form" onSubmit={handleSubmit}>
      <h3>
        Register Form
      </h3>
      <div>
        <label htmlFor='patientNo'>Patient No.:</label><br />
        <input type="text" id='patientNo' name="patientId" value={patient.patientId} onChange={handleChange} readOnly />
      </div>
      <div>
        <label htmlFor='firstName'>First Name:</label><br />
        <input type="text" id='firstName' name="firstName" value={patient.firstName} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='lastName'>Last Name:</label><br />
        <input type="text" id='lastName' name="lastName" value={patient.lastName} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='street'>Street:</label><br />
        <input type="text" id='street' name="street" value={patient.street} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='city'>City:</label><br />
        <input type="text" id='city' name="city" value={patient.city} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='state'>State:</label><br />
        <input type="text" id='state' name="state" value={patient.state} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='country'>Country:</label><br />
        <input type="text" id='country' name="country" value={patient.country} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='telephone'>Telephone:</label><br />
        <input type="text" id='telephone' name="telephone" value={patient.telephone} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='contactEmail'>Contact Email:</label><br />
        <input type="email" id='contactEmail' name="contactEmail" value={patient.contactEmail} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='status'>Status:</label><br />
        <select name="status" id="status"><option value="Checked In">Checked In</option> </select>

      </div>
      <div className="form-actions">
        <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
        <button type="submit" className="submit-btn">Add</button>
      </div>
    </form>
  </div>
  );
};

export default PatientForm;
