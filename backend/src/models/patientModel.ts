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
  statusStartTime: Date;
  updatedAt: Date;
  surgeryType:string;
}

const patientSchema = new Schema<PatientType>({
  patientId: { type: String, required: true, unique: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  telephone: { type: Number, required: true },
  contactEmail: { type: String, required: true, trim: true },
  status: { type: Schema.Types.ObjectId, ref: 'Status', required: true },
  statusStartTime: { type: Date, default: Date.now },
  surgeryType: { 
    type: String, 
    enum: ['Type 1 - Basic', 'Type 2 - Moderate', 'Type 3 - Critical'], 
    required: true,
    trim: true
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export const Patient = mongoose.model<PatientType>('Patient', patientSchema);
