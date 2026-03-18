import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  progressPercent: number; // 0-100
}

const skillSchema = new Schema<ISkill>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  progressPercent: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true });

export const Skill = mongoose.model<ISkill>('Skill', skillSchema);
