import mongoose, { Document, Schema } from 'mongoose';

export interface PatientType extends Document {
  patientId: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  telephone: number;
  contactEmail: string;
  createdAt: Date;
}

const patientSchema = new Schema<PatientType>({
  patientId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  telephone: { type: Number, required: true },
  contactEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Patient = mongoose.model<PatientType>('Patient', patientSchema);
