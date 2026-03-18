import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  targetTime: number; // in seconds
  progressTime: number; // in seconds
  completed: boolean;
  dueDate?: Date;
}

const goalSchema = new Schema<IGoal>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  targetTime: { type: Number, required: true },
  progressTime: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
}, { timestamps: true });

export const Goal = mongoose.model<IGoal>('Goal', goalSchema);
