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
  createdAt: string;
  status: { code: string } | string;
}
