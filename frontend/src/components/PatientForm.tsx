// components/PatientForm.tsx
import React, { useState } from 'react';
import axios from 'axios'; //
import './PatientForm.css'; // we'll add basic CSS to match the UI

interface Patient {
  patientNo: string; // Optional if it's system generated
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  telephone: string;
  email: string;
  status:string;
}

const initialState: Patient = {
  patientNo:"",
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  country: '',
  telephone: '',
  email: '',
  status:'',
};

const PatientForm: React.FC = () => {
  const [patient, setPatient] = useState<Patient>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Patient Data:', patient);
    // TODO: Send to backend
    try {
      const response = await axios.post('http://localhost:5000/api/patients', patient);
      console.log('Saved:', response.data);
      alert("Patient Registered Successfully!");
      setPatient(initialState);
    } catch (err) {
      console.error('Error:', err);
      alert("Something went wrong while saving.");
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
        <input type="text" id='patientNo' name="patientNo" value={patient.patientNo} onChange={handleChange} />
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
        <label htmlFor='email'>Contact Email:</label><br />
        <input type="email" id='email' name="email" value={patient.email} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='status'>Status:</label><br />
        {/* <input type="" id='status' name="status" value={patient.status} onChange={handleChange} /> */}
        <select name="status" id="status"><option value="Checked In">Checked In</option> </select>
        
      </div>
      <div className="form-actions">
        <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
        <button type="submit" className="submit-btn">Add/Update</button>
      </div>
    </form>
    </div>
  );
};

export default PatientForm;
