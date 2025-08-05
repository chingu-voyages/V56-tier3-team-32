import mongoose, { Document, Schema } from 'mongoose';

export interface IStatus extends Document {
  code: string;
  description: string;
  default_time: number;
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
  //This is the default time in minutes for each status
  default_time: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, { timestamps: true });

//to add any new status codes, you must update the enum above

const Status = mongoose.model<IStatus>('Status', StatusSchema);

export default Status;
