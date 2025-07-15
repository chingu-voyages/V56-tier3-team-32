import mongoose, { Document, Schema } from 'mongoose';

export interface IStatus extends Document {
  code: string;
  description: string;
  color: string;
}

const StatusSchema: Schema = new Schema<IStatus>({
  code: {
    type: String,
    required: true,
    unique: true,
    enum: [
      'Checked In', 'Pre-Procedure', 'Anesthesia', 'In-Progress',
      'Suturing', 'Closing', 'Recovery', 'Observation',
      'Complete', 'Dismissal'
    ]
  },
  description: { type: String, required: true },
  color: { type: String, required: true }
}, { timestamps: true });

const Status = mongoose.model<IStatus>('Status', StatusSchema);

export default Status;
