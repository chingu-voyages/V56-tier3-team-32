export interface Patient {
  _id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  telephone: number;
  contactEmail: string;
  status: { code: string };
   statusStartTime?: string;
  updatedAt: string;
  statusDuration: string; 
  createdAt: string;
}
