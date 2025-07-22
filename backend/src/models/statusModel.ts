import mongoose, { Document, Schema } from 'mongoose';

export interface IStatus extends Document {
  code: string;
  description: string;
}

const StatusSchema: Schema = new Schema<IStatus>({
  code: {
    type: String,
    required: true,
    unique: true,
    enum: [
      'Checked In', 'Pre-Procedure', 'In-Progress',
       'Closing', 'Recovery', 
      'Complete', 'Dismissal'
    ]
  },
  description: { type: String, required: true },
}, { timestamps: true });

//to add any new status codes, you must update the enum above

const Status = mongoose.model<IStatus>('Status', StatusSchema);

export default Status;
