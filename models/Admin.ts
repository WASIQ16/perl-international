import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  passwordHash: string;
  resetOtp?: string;
  resetOtpExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema: Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    resetOtp: {
      type: String,
      required: false,
    },
    resetOtpExpiry: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema);
