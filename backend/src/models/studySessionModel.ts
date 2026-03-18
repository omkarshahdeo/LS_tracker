import mongoose, { Document, Schema } from 'mongoose';

export interface IStudySession extends Document {
  user: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  subject?: string;
  category?: string;
}

const studySessionSchema = new Schema<IStudySession>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true, min: 0 },
  subject: { type: String },
  category: { type: String },
}, { timestamps: true });

export const StudySession = mongoose.model<IStudySession>('StudySession', studySessionSchema);
