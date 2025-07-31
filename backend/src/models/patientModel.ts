import mongoose, { Document, Schema } from 'mongoose';
import Status from './statusModel';

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
  updatedAt: Date;
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
  // The `createdAt` field is managed automatically by the `timestamps` option.
  status: { type: Schema.Types.ObjectId, ref: 'Status', required: true },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export const Patient = mongoose.model<PatientType>('Patient', patientSchema);
