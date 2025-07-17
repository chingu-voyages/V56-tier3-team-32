import mongoose, { Document, Schema } from 'mongoose';
import Status from './Status';

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
  status: mongoose.Types.ObjectId;
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
  status: { type: Schema.Types.ObjectId, ref: 'Status', required: true },
});

export const Patient = mongoose.model<PatientType>('Patient', patientSchema);
