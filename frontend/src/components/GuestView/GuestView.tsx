import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getStatusColor } from '../../utils/StatusColors';
import './GuestView.css';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

type Patient = {
    patientId: string;
    status: {
        code: string;
    };
};

const GuestView: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [changedIds, setChangedIds] = useState<string[]>([]);
    const prevPatientsRef = useRef<Patient[]>([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/patients/recents`);
                const newPatients: Patient[] = response.data;

                // Detect changed statuses
                const changed: string[] = [];
                prevPatientsRef.current.forEach(prev => {
                    const curr = newPatients.find(p => p.patientId === prev.patientId);
                    if (curr && curr.status.code !== prev.status.code) {
                        changed.push(curr.patientId);
                    }
                });

                setPatients(newPatients);
                setChangedIds(changed);

                // Remove vibrate after 2s
                if (changed.length > 0) {
                    setTimeout(() => {
                        setChangedIds(ids => ids.filter(id => !changed.includes(id)));
                    }, 2000);
                }

                setError(null);
                prevPatientsRef.current = newPatients;
            } catch (err) {
                setError('Failed to fetch patient data.');
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
        const interval = setInterval(fetchPatients, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="guest-view">
            <h2 className="title">GUEST VIEW</h2>
            <div className="grid-look">
                {patients.map((patient) => (
                    <div
                        key={patient.patientId}
                        className={`patient-card move-animation${changedIds.includes(patient.patientId) ? ' pulse-animation' : ''}`}
                        style={{ backgroundColor: getStatusColor(patient.status.code) }}
                    >
                        <div className="font-bold text-3xl glow-text">{patient.patientId}</div>
                        <div className="text-2xl font-semibold text-gray-500">
                            {patient.status.code}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GuestView;
