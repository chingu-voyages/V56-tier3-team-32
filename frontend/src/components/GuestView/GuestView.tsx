import React, { useEffect, useState } from "react";
import { getStatusColor } from "../../utils/StatusColors";
import "./GuestView.css";

type Patient = {
    patientId: string;
    status: string | { code: string };
};

const ROWS = 2;
const COLS = 3;
const ENTRIES_PER_PAGE = ROWS * COLS;
const INTERVAL_MS = 10000;
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const GuestView: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [startIndex, setStartIndex] = useState(0);

    // Fetch patients on mount
    useEffect(() => {
        fetch(`${BASE_URL}/patients/anonymized`)
            .then((res) => res.json())
            .then((data) => setPatients(data))
            .catch(() => setPatients([]));
    }, []);

    // Move the window every 10 seconds
    useEffect(() => {
        if (patients.length === 0) return;
        const interval = setInterval(() => {
            setStartIndex((prev) => (prev === 0 ? patients.length - 1 : prev - 1));
        }, INTERVAL_MS);
        return () => clearInterval(interval);
    }, [patients.length]);

    // Get the 6 patients to display, shifting window forwards so new entry is from the last
    const displayedPatients = Array.from({ length: ENTRIES_PER_PAGE }, (_, i) => {
        return patients.length > 0
            ? patients[(startIndex + i) % patients.length]
            : undefined;
    });

    return (
        <div
            className="grid-layout"
            style={{
                gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
               
            }}
        >
            {Array.from({ length: ENTRIES_PER_PAGE }).map((_, idx) => {
                const patient = displayedPatients[idx];
                if (!patient) {
                    return <div key={idx} />;
                }
                const status =
                    typeof patient.status === "object" && patient.status !== null
                        ? patient.status.code
                        : patient.status;
                const bgColor = getStatusColor(status);
                return (
                    <div
                        key={idx}
                        className="entry"
                        style={{
                            background: bgColor,
                        }}
                    >
                        <div className="patient-id">{patient.patientId}</div>
                        <div className="status">
                            {status}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GuestView;